## Deploy gmail-parser

gcloud config set project gmail-parser-386517

gcloud run deploy gmail-parser \
 --allow-unauthenticated \
 --region=us-central1 \
 --timeout=1m

gcloud run deploy gmail-parser \
 --allow-unauthenticated \
 --region=us-central1 \
 --min-instances=1 \
 --memory=1024Mi \
 --timeout=1m

## Tasks

-   Create a task queue: `gcloud tasks queues create NAME`
-   Describe task: `gcloud tasks queues describe NAME`

## [Set up Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc#attached-sa)

To create a service account key and make it available to ADC:

1. Create a service account with the roles your application needs, and a key for that service account, by following the instructions in Creating a service account key.

2. Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the path of the JSON file that contains your service account key. This variable only applies to your current shell session, so if you open a new session, set the variable again.

```
export GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
```

```
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

```
gcloud auth application-default set-quota-project gmail-parser-386517
```

## To log in:

gcloud auth login automations@peakleads.io
gcloud config set project gmail-parser-386517
