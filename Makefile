configure-functions:
	@echo ${DOMAIN}
	@cat functions/src/config.tmpl.ts \
		| sed 's@_EMAIL_DOMAIN_@'"${EMAIL_DOMAIN}"'@' \
		| sed 's@_DOMAIN_@'"${DOMAIN}"'@' \
		| sed 's@_MAILGUN_API_KEY_@'"${MAILGUN_API_KEY}"'@' \
		| sed 's@_GCAL_CALENDAR_ID_@'"${GCAL_CALENDAR_ID}"'@' \
		| sed 's@_GCAL_PRIVATE_KEY_@'"${GCAL_PRIVATE_KEY}"'@' \
		| sed 's@_GCAL_CLIENT_EMAIL_@'"${GCAL_CLIENT_EMAIL}"'@' \
		| sed 's@_GCP_PROJECT_ID_@'"${GCP_PROJECT_ID}"'@' > functions/src/config.ts
configure-functions-staging:
	@echo "Will populate config.ts with runtime secrets"
	@$(MAKE) DOMAIN=${DOMAIN_STAGING} \
		MAILGUN_API_KEY=${MAILGUN_API_KEY_STAGING} \
		GCP_PROJECT_ID=${GCP_PROJECT_ID_STAGING} \
		EMAIL_DOMAIN=${EMAIL_DOMAIN_STAGING} \
		GCAL_CALENDAR_ID=${GCAL_CALENDAR_ID_STAGING} \
		GCAL_PRIVATE_KEY=${GCAL_PRIVATE_KEY_STAGING} \
		GCAL_CLIENT_EMAIL=${GCAL_CLIENT_EMAIL_STAGING} \
		configure-functions



