# deploy fortio - use to test other services

```sh

kubectl create deploy fortio --image=fortio/fortio:latest

# run fortio to test hello-js service
# [-t 10s, duration second] [-qps 100, Total Queries Per Seconds]
# [-c 10, concurrency] [-loglevel Warning, log level]

kubectl exec ${FORTIO_POD} -c fortio -- /usr/bin/fortio load -qps 100 -t 5s -c 20  http://hello-js-svc:80/api/hello

```

# build

``` sh
export HELLO_VER=3.6

docker build -t albertou/hello-js:${HELLO_VER}  .
# docker tag hello-js:${HELLO_VER} albertou/hello-js:${HELLO_VER}
docker push  albertou/hello-js:${HELLO_VER} 
```

# deploy

``` sh

# kubectl apply -f k8s/deploy.yaml

kubectl delete deploy hello-js
kubectl create deploy hello-js --image=albertou/hello-js:${HELLO_VER} --port=3000 

# change image
kubectl set image deployment/hello-js hello-js=albertou/hello-js:${HELLO_VER}
k get pod --watch

```
# service

``` sh
kubectl apply -f k8s/service.yaml

kubectl expose deployment hello-js --port=3000 --target-port=3000 --type=ClusterIP --name=hello-js-svc
``` 
