# VirtualService: timeout vs perTryTimeout

 The interval between retries (25ms+) is variable and determined automatically by Istio

**perTryTimeout * retries** should not exceed the global **timeout** . If it does, the retry attempts that fall outside the global timeout will be ignored.

```yaml
virtualService:
    timeout: 10s
    retries:
      attempts: 3
      perTryTimeout: 3s
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
```

Timeout per try always 3s (including initial call), but the total timeout for all attempts is 8s.

* An attempt is marked as failed if it takes longer than 3 seconds.
* There are going to be a maximum of 3 attempts.
    * 3s (initial call) + 3s + 2s = 8s
* The overall waiting time for a successful attempt will not be longer than 8 seconds.
