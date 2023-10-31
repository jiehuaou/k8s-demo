# k8s-demo
practice k8s/istio/knative

# DNS in WSL2

if "docker pull anything" error, should place setting in /etc/resolv.conf

```text

nameserver 172.25.208.1  # my vpn proxy

nameserver 8.8.8.8  # google dns
nameserver 8.8.4.4  # google dns

```

# registry map 国内镜像
```sh
#这两条语句是等效的
docker pull  k8s.gcr.io/kube-apiserver:v1.15.2
docker pull  gcr.azk8s.cn/google-containers/kube-apiserver:v1.15.2

#这两条也是等效的
docker pull quay.io/xxx/yyy:zzz
docker pull quay.azk8s.cn/xxx/yyy:zzz

# equal
registry.k8s.io	    registry.lank8s.cn
registry.k8s.io	    lank8s.cn
gcr.io	            gcr.lank8s.cn

```

# golang proxy in china

Linux, Open your terminal and execute

```sh
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
```