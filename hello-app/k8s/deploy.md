# build


docker build -t hello-js:3.3  .

docker tag hello-js:3.3 albertou/hello-js:3.3

docker push  albertou/hello-js:3.3

# deploy

kubectl apply -f k8s/deploy.yaml

kubectl delete deploy hello-js

kubectl create deploy hello-js --image=albertou/hello-js:3.3 --port=3000 

# service

kubectl apply -f k8s/service.yaml

kubectl expose deployment hello-js --port=3000 --target-port=3000 --type=ClusterIP --name=hello-js-svc

