# setup WSL2 proxy
add export in .bashrc

```bash
export http_proxy=http://host.docker.internal:7890
export https_proxy=http://host.docker.internal:7890
no_proxy=localhost,127.*,10.*,172.16.*,172.17.*,172.18.*,172.19.*,172.20.*,172.21.*,172.22.*,172.23.*,172.24.*,172.25.*,172.26.*,172.27.*,172.28.*,172.29.*,172.30.*,172.31.*,192.168.*,192.168.49.2
```

# install helm

```bash
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh 
chmod 700 get_helm.sh 
./get_helm.sh
```


# Download the latest Minikube
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Make it executable
chmod +x ./minikube

# Move it to your user's executable PATH
sudo mv ./minikube /usr/local/bin/

# Set the driver version to Docker
minikube config set driver docker

# check k8s version
https://cdn.dl.k8s.io/release/stable.txt

# Download the latest Kubectl
curl -LO "https://dl.k8s.io/release/v1.28.2/bin/linux/amd64/kubectl"


# Make it executable
chmod +x ./kubectl

# Move it to your user's executable PATH
sudo mv ./kubectl /usr/local/bin/


# Running Minikube to create a local Kubernetes cluster
minikube start --kubernetes-version v1.28.2

# Once your minikube starts working, type:
kubectl config use-context minikube


# Start minikube again to enable kubectl in it
minikube start
kubectl get pods -A

# enable the NGINX Ingress controller, run the following command:
minikube addons enable ingress

> Note: It can take up to a minute before you see these pods running OK.

# Verify that the NGINX Ingress controller is running
kubectl get pods -n ingress-nginx

```shell
ingress-nginx-admission-create-v4m59        0/1     Completed   0             
ingress-nginx-admission-patch-ngkgt         0/1     Completed   2               
ingress-nginx-controller-5dcd45b5bf-8p8d7   1/1     Running     3 
```

# create sample deploy
kubectl create deployment nginx-deployment --image=nginx

kubectl create deployment go-web --image=gcr.io/google-samples/hello-app:1.0

# Expose ngnix App as service
kubectl expose deployment nginx-deployment --port=80 --target-port=80 --type=ClusterIP --name=nginx-service

kubectl expose deployment go-web       --port=8080 --target-port=8080 --type=ClusterIP --name=go-web-svc

# Visit the Service via NodePort:
minikube service nginx-service --url

minikube service go-web-svc --url

# map in ingress
kubectl apply -f my-ingress.yaml

# invoke ingress

curl --resolve "hello.local:192.168.49.2" -i http://hello.local/app

curl -v http://hello-world.info/web

curl -v http://hello.local.info/app


# port-forward service for temporary access
kubectl port-forward svc/nginx-service 80:80

sudo kubectl port-forward pod/nginx-deployment-66fb7f764c-v89rw 80:80

# proxy service for temporary access
kubectl proxy 


