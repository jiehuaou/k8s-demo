# build

docker build -t hello-js:1.0  .
docker build -t hello-js:2.0  .

docker tag hello-js:1.0 albertou/hello-js:1.0
docker tag hello-js:2.0 albertou/hello-js:2.0

docker push  albertou/hello-js:1.0
docker push  albertou/hello-js:2.0

# deploy

kubectl apply -f k8s/deploy.yaml

kubectl create deploy hello-js --image=albertou/hello-js:1.0 --port=3000 
kubectl create deploy hello-js --image=albertou/hello-js:2.0 --port=3000 

# service

kubectl apply -f k8s/service.yaml

kubectl expose deployment hello-js --port=3000 --target-port=3000 --type=ClusterIP --name=hello-js-svc

