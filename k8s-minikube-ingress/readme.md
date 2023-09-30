# demo : WSL2, minikube, ingress
---------------------------------------
# setup WSL2 proxy
add export in .bashrc

without proxy properly configured, curl will get messed up.

```bash
export http_proxy=http://host.docker.internal:7890
export https_proxy=http://host.docker.internal:7890

export no_proxy="`echo {1..99},` .info"

```

# install helm

```bash
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh 
chmod 700 get_helm.sh 
./get_helm.sh
```


# Download the latest Minikube

```sh
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```

# Make it executable, Move it to your user's executable PATH

```sh
chmod +x ./minikube
# 
sudo mv ./minikube /usr/local/bin/
```

# Set the driver version to Docker

```sh
minikube config set driver docker
```

# check k8s version
https://cdn.dl.k8s.io/release/stable.txt

currently it is v1.28.2

# Download the latest Kubectl

```sh
curl -LO "https://dl.k8s.io/release/v1.28.2/bin/linux/amd64/kubectl"
```

# Make it executable, Move it to your user's executable PATH

```sh
chmod +x ./kubectl

sudo mv ./kubectl /usr/local/bin/
```

# Running Minikube to create a local Kubernetes cluster

```sh
minikube start --kubernetes-version v1.28.2
```

# Once your minikube starts working, type:

```sh
kubectl config use-context minikube
```

# Start minikube again to enable kubectl in it

```bash
minikube start
kubectl get pods -A
```

# enable the NGINX Ingress controller, run the following command:

```sh
minikube addons enable ingress
```

> Note: It can take up to a minute before you see these pods running OK.

# Verify that the NGINX Ingress controller is running

```sh
kubectl get pods -n ingress-nginx

# output
ingress-nginx-admission-create-v4m59        0/1     Completed   0             
ingress-nginx-admission-patch-ngkgt         0/1     Completed   2               
ingress-nginx-controller-5dcd45b5bf-8p8d7   1/1     Running     3 
```

# create sample deploy

```bash
kubectl create deployment nginx-deployment --image=nginx

kubectl create deployment go-web --image=gcr.io/google-samples/hello-app:1.0
```

# Expose ngnix App as service

```bash
kubectl expose deployment nginx-deployment --port=80 --target-port=80 --type=ClusterIP --name=nginx-service

kubectl expose deployment go-web       --port=8080 --target-port=8080 --type=ClusterIP --name=go-web-svc
```

# Visit the Service via NodePort:

```bash
minikube service nginx-service --url

minikube service go-web-svc --url
```

# map in ingress

```sh
kubectl apply -f my-ingress.yaml
```

# config /etc/hosts

```
192.168.49.2 hello-world.info
192.168.49.2 hello.local.info

```

# invoke ingress

```bash
curl --resolve "hello-world.info:80:$(minikube ip)" -i http://hello-world.info/web


curl -v http://hello-world.info/web

curl -v http://hello.local.info/app
```


# port-forward service for temporary access

```bash
kubectl port-forward svc/nginx-service 80:80

sudo kubectl port-forward pod/nginx-deployment-66fb7f764c-v89rw 80:80
```

# show up dashboard

```sh
minikube dashboard
```


