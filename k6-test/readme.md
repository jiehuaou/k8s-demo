# install CRD

https://github.com/grafana/k6-operator

# to configure through ConfigMap:

```sh
kubectl create configmap my-test --from-file ~/test/test-k8s.js

kubectl create configmap my-test --from-file ~/test/test-k8s.js -o yaml --dry-run=client | kubectl apply -f -

kubectl create configmap --dry-run=client somename --from-file=./conf/nginx.conf --output yaml

```

# deploy TestRun

```sh
kubectl apply -f k6-runer-k8s.yaml

```