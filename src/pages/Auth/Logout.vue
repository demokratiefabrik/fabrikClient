<template>
  <q-page class="doc_content">

    <h1>{{$t('auth.logout_succeeded_title')}}</h1>
    <p>{{$t('auth.logout_succeeded_caption')}}</p>
  </q-page>
</template>


<script>
export default {
  computed: {
    bookmarkKeys() {
      return (
        (navigator.userAgent.toLowerCase().indexOf("mac") != -1
          ? "Cmd"
          : "CTRL") + " + D"
      );
    },
  },
};
</script>
