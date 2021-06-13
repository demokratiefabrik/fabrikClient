<template>
  <q-page class="doc_content"></q-page>
</template>

<script>
export default {
  name: "EmptyPage",
  mounted() {
    // Add token to extraAuthorizationParams config param of PKCE Plugin (It is transmitted to the oAuth Server...)
    const transmittedTToken = this.$router.currentRoute.params?.ttoken;
    const transmittedLToken = this.$router.currentRoute.params?.ltoken;
    const extraParams = this.pkce.config.extraAuthorizationParams
      ? this.pkce.config.extraAuthorizationParams
      : {};

    // unlimited token
    if (transmittedTToken) {
      extraParams.token = transmittedTToken;
    }

    // limited token (only valid for few days => hinterlegt im backend...)
    if (transmittedLToken) {
      extraParams.ltoken = transmittedLToken;
    }

    this.pkce.config.extraAuthorizationParams = extraParams;
    this.oauth.login();
  },
};
</script>
