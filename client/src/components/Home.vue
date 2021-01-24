<template>
	<v-container>
		<v-container>
			<h1>Home</h1>
		</v-container>
		<v-layout row>
			<v-dialog v-model="loading" persistent fullscreen>
				<v-container fill-height>
					<v-layout row justify-center align-center>
						<v-progress-circular
							indeterminate
							:size="70"
							width="7"
							color="secondary"
						></v-progress-circular>
					</v-layout>
				</v-container>
			</v-dialog>
		</v-layout>
		<v-flex v-if="!loading">
			<ul v-for="cust in customers" :key="cust._id">
				<li>{{ cust.name }} {{ cust.email }}</li>
			</ul>
		</v-flex>
	</v-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";

export default {
	name: "Home",
	// execute when component is created
	created() {
		this.handleCustomers();
	},
	computed: {
		...mapGetters(["loading", "customers"]),
	},
	methods: {
		handleCustomers() {
			// getter from vuex
			this.$store.dispatch("getCustomers");
		},
	},
};
</script>
