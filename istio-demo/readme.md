# VirtualService: timeout vs perTryTimeout

 The interval between retries (25ms+) is variable and determined automatically by Istio

**perTryTimeout * retries** should not exceed the global **timeout** . If it does, the retry attempts that fall outside the global timeout will be ignored.

```yaml
virtualService:
    timeout: 10s
    retries:
      attempts: 3
      perTryTimeout: 3s
      retryOn: 5xx
```
Timeout per try always 3s (including initial call), but the total timeout for all attempts is 10s.

* An attempt is marked as failed if it takes longer than 3 seconds.
* There are going to be a maximum of 3+1 attempts.
    * 3s (initial call) + 3s + 3s + 1s = 10s
* The overall waiting time for a successful attempt will not be longer than 10 seconds.

```yaml
virtualService:
    timeout: 8s
    retries:
      attempts: 3
      perTryTimeout: 3s
      retryOn: 5xx
```

Timeout per try always 3s (including initial call), but the total timeout for all attempts is 8s.

* An attempt is marked as failed if it takes longer than 3 seconds.
* There are going to be a maximum of 3 attempts.
    * 3s (initial call) + 3s + 2s = 8s
* The overall waiting time for a successful attempt will not be longer than 8 seconds.

# test case 1 - HTTP/1.1 504 Timeout after 9 seconds and 3 attempts

```yaml
virtualService:
    timeout: 10s
    retries:
      attempts: 3
      perTryTimeout: 3s
      retryOn: 5xx
```

* deploy hello-js service
* deploy ingress gateway
* deploy virtualService
* open istio-ingressgateway via minikube

```bash
kubectl create deploy hello-js --image=albertou/hello-js:3.3 --port=3000 
kubectl expose deployment hello-js --port=3000 --target-port=3000 --type=ClusterIP --name=hello-js-svc

kubectl apply -f istio-gateway.yaml
kubectl apply -f hello-virtual-service.yaml

# open the url via minikube
minikube service istio-ingressgateway -n istio-system --url

# watch logs
kubectl logs -f hello-js-pod-xxx

```

```bash
# hello service (id:1) will wait 5000 ms, and istio will retry 3 times
time curl http://127.0.0.1:46021/hello-app/hello/slow/5000/a1

```

logs was shown, service was retryed 3 times
```txt
Koa.js server listening at http://localhost:3000

Hello 7 slow a1 ... called at Mon Nov 06 2023 02:37:40 GMT+0000 (Coordinated Universal Time)
Hello 8 slow a1 ... called at Mon Nov 06 2023 02:37:43 GMT+0000 (Coordinated Universal Time)
Hello 9 slow a1 ... called at Mon Nov 06 2023 02:37:46 GMT+0000 (Coordinated Universal Time)
Hello 10 slow a1 ... called at Mon Nov 06 2023 02:37:49 GMT+0000 (Coordinated Universal Time)

```

total time was 10.019s
```txt
real    0m10.019s
user    0m0.007s
sys     0m0.000s
```

# test case 2 - HTTP/1.1 500 after 4 attempts

```bash
# hello service (id:2) will return 500 http code immediately, 
# and istio will retry 4 times totally

time curl http://127.0.0.1:46021/hello-app/hello/error/500/2

```

logs was shown, service was retryed 4 times
```txt
Hello error 2 ... called at Thu Oct 05 2023 12:05:31 GMT+0000 
Hello error 2 ... called at Thu Oct 05 2023 12:05:31 GMT+0000 
Hello error 2 ... called at Thu Oct 05 2023 12:05:32 GMT+0000 
Hello error 2 ... called at Thu Oct 05 2023 12:05:32 GMT+0000 
```

total time was 2.112s, since hello service does not wait in this path /hello/error/500/2
```txt
real    0m2.112s
user    0m0.000s
sys     0m0.004s
```

# Istio Circuit Breaker With Outlier Detection

The basic intent of outlier detection is to stop sending requests to an unhealthy instance and give it time to recover.

```yaml
trafficPolicy:
    connectionPool:
        http: {}
        tcp: {}
    loadBalancer:
        simple: RANDOM
    outlierDetection:
        baseEjectionTime: 20s
        consecutive5xxErrors: 3
        interval: 10s
        maxEjectionPercent: 100
```

* __BaseEjectionTime__ - The maximum ejection duration for a host. For example, the host will be ejected for 20 seconds before it is evaluated again for processing requests.
* __consecutive5xxErrors__ - Number of errors before a host is ejected from the connection pool. For example, if you have three consecutive errors while interacting with a service, Istio will mark the pod as unhealthy.
* __Interval__ - The time interval for ejection analysis. For example, the service dependencies are verified every 10 seconds.
* __MaxEjectionPercent__ - The max percent of hosts that can be ejected from the load balanced pool. For example, setting this field to 100 implies that any unhealthy pods throwing consecutive errors can be ejected and the request will be rerouted to the healthy pods.

```sh
k apply -f  DestinationRule.yaml

istioctl analyze 

export FORTIO_POD=fortio-5d99948b99-99ps6

kubectl exec ${FORTIO_POD} -c fortio -- /usr/bin/fortio load -loglevel Warning -n 30  http://hello-ab-svc:3000/api/hello/error/500/a

```
