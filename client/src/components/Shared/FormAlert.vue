<template>
	<v-alert type="error" :value="true" dismissible>{{ message }}</v-alert>
</template>

<script>
export default {
	props: ["message"],
};
</script>