# deploy with ENABLE_HELLO_ERROR on/off

``` sh
export HELLO_VER=3.9

k apply -f deploy-ab.yaml

k get pod --watch

```

# test hello-ab-svc service with minikube

```sh

mk service hello-ab-svc --url

curl -v http://127.0.0.1:36351/api/hello/error/500/a1

curl -v http://127.0.0.1:36351/api/hello/error/500/a2

# pod was called in round-robin way, 
# one is code-500, another is code-200

```

# test hello-ab-svc service with fortio

```sh
export FORTIO_POD=$(kubectl get pods -l app=fortio -o jsonpath='{.items[0].metadata.name}')

kubectl exec ${FORTIO_POD} -c fortio -- /usr/bin/fortio load -loglevel Warning -n 3  http://hello-ab-svc:3000/api/hello/error/500/a

```

# change replication 
```sh
kubectl scale deployment hello-js-off-deploy --replicas=0
```