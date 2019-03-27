configure-functions:
	@cat server/src/config.tmpl.ts \
		| sed 's&_EMAIL_DOMAIN_&'"${EMAIL_DOMAIN}"'&' \
		| sed 's&_DOMAIN_&'"${DOMAIN}"'&' \
		| sed 's&_MAILGUN_API_KEY_&'"${MAILGUN_API_KEY}"'&' \
		| sed 's&_GCP_PROJECT_ID_&'"${GCP_PROJECT_ID}"'&' > server/src/config.ts
configure-functions-staging:
	@echo "Will populate config.ts with runtime secrets"
	@$(MAKE) DOMAIN=${DOMAIN_STAGING} \
		MAILGUN_API_KEY=${MAILGUN_API_KEY_STAGING} \
		GCP_PROJECT_ID=${GCP_PROJECT_ID_STAGING} \
		EMAIL_DOMAIN=${EMAIL_DOMAIN_STAGING} \
		configure-functions
