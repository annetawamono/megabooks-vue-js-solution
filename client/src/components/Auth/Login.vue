<template>
	<v-container text-xs-center mt-5 pt-5>
		<!-- Error Alert -->
		<v-layout v-if="error" row wrap>
			<v-flex xs12 sm4 offset-sm4>
				<form-alert :message="error.message"></form-alert>
			</v-flex>
		</v-layout>

		<!-- Sign in title -->
		<v-layout row wrap mb-5>
			<v-flex xs12 sm6 offset-sm4><h1>Login</h1></v-flex>
		</v-layout>

		<!-- Sign in form -->
		<v-layout row wrap>
			<v-flex xs12 sm6 offset-sm4>
				<v-container>
					<v-form
						:v-model="isFormValid"
						lazy-validation
						ref="form"
						@submit.prevent="handleSignInUser"
					>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="email"
									:rules="emailRules"
									outlined
									label="Email"
									type="email"
									required
									clearable
								></v-text-field>
							</v-flex>
						</v-layout>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="password"
									:rules="passwordRules"
									outlined
									label="Password"
									:type="show1 ? 'text' : 'password'"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									hint="At least 8 characters"
									counter
									required
									@click:append="show1 = !show1"
								></v-text-field>
							</v-flex>
						</v-layout>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-btn
									color="accent"
									type="submit"
									:disabled="!isFormValid || loading"
									mb-5
									>Sign in</v-btn
								>
								<v-container mt-5>
									<p>
										Don't have an account?
										<router-link to="/register">Register</router-link>
									</p>
								</v-container>
							</v-flex>
						</v-layout>
					</v-form>
				</v-container>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Login",
	data() {
		return {
			isFormValid: true,
			show1: false,
			email: "",
			password: "",
			emailRules: [
				(email) => !!email || "Email is required",
				(email) => {
					let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
					return reg.test(email) || "Email is not valid";
				},
			],
			passwordRules: [
				(password) => !!password || "Password is required",
				(password) => password.length >= 8 || "Password must be greater than 8",
			],
		};
	},
	computed: {
		...mapGetters(["user", "error", "loading"]),
	},
	watch: {
		// keep track of when user (state) changes
		user() {
			this.$router.push("/dashboard");
		},
	},
	methods: {
		handleSignInUser() {
			// (ref attribute on form) checks to see if form is valid first
			if (this.$refs.form.validate()) {
				this.$store.dispatch("signInUser", {
					email: this.email,
					password: this.password,
				});
			}
		},
	},
};
</script>