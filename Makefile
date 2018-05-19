configure-functions:
	@echo ${DOMAIN}
	@cat functions/src/config.tmpl.ts \
		| sed 's@_DOMAIN_@'"${DOMAIN}"'@' \
		| sed 's@_MAILGUN_API_KEY_@'"${MAILGUN_API_KEY}"'@' \
		| sed 's@_EMAIL_DOMAIN_@'"${EMAIL_DOMAIN}"'@' \
		| sed 's@_GCP_PROJECT_ID_@'"${GCP_PROJECT_ID}"'@' > functions/src/config.ts
configure-functions-staging:
	@$(MAKE) DOMAIN=${DOMAIN_STAGING} \
		MAILGUN_API_KEY=${MAILGUN_API_KEY_STAGING} \
		GCP_PROJECT_ID=${GCP_PROJECT_ID_STAGING} \
		EMAIL_DOMAIN=${EMAIL_DOMAIN_STAGING} \
		configure-functions