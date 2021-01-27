<template>
	<v-container mt-5>
		<v-layout row>
			<v-flex>
				<h1>Customer Dashboard</h1>
			</v-flex>
		</v-layout>

		<!-- Error Alert -->
		<v-layout v-if="error" row wrap>
			<v-flex xs12 sm4 offset-sm4>
				<form-alert :message="error.message"></form-alert>
			</v-flex>
		</v-layout>

		<!-- Loading spinner -->
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

		<v-data-table
			:search="search"
			:headers="headersCustomers"
			:items="customers"
			sort-by="calories"
			class="elevation-1 mt-5"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						label="Search"
						single-line
						hide-details
					></v-text-field>
					<v-spacer></v-spacer>

					<!-- Add / Edit dialog -->
					<v-dialog v-model="dialog" max-width="500px">
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-form
										:v-model="isFormValid"
										lazy-validation
										ref="form"
										@submit.prevent
									>
										<v-row>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.name"
													label="Customer name"
													:rules="nameRules"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.surname"
													label="Surname"
													:rules="nameRules"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.email"
													label="Email"
													:rules="emailRules"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.phone"
													label="Phone number"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.bookDescription"
													label="Book Description"
													:disabled="editedIndex !== -1"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.bookPrice"
													label="Book Price (R)"
													:rules="currencyRules"
													:disabled="editedIndex !== -1"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.purchaseDate"
													label="Purchase date"
													:rules="dateRules"
													:disabled="editedIndex !== -1"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editedCustomer.isbn"
													label="ISBN"
													:disabled="editedIndex !== -1"
												></v-text-field>
											</v-col>
										</v-row>
									</v-form>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">
									Cancel
								</v-btn>
								<v-btn
									color="blue darken-1"
									:disabled="!isFormValid"
									text
									@click="save"
								>
									Save
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline"
								>Are you sure you want to delete this item?</v-card-title
							>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="closeDelete"
									>Cancel</v-btn
								>
								<v-btn color="blue darken-1" text @click="deleteItemConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon small class="mr-2" @click="newItem(item)"> mdi-plus </v-icon>
				<v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
				<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Dashboard",
	// execute when component is created
	created() {
		this.handleCustomers();
	},
	data() {
		return {
			search: "",
			isFormValid: true,
			nameRules: [
				(name) => {
					if (name) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "This field is required";
				},
				(name) => {
					let reg = /^([A-Za-z])+$/;
					if (reg.test(name)) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "This field contains invalid characters.";
				},
			],
			currencyRules: [
				(curr) => {
					if (curr) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "This field is required";
				},
				(curr) => {
					let reg = /^([0-9]+)\.([0-9]{2})$/;
					if (reg.test(curr)) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "Use input like 12.09";
				},
			],
			dateRules: [
				(date) => {
					if (date) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "This field is required";
				},
				(date) => {
					if (Date.parse(date)) {
						this.isFormValid = true;
						return true;
					}
					this.isFormValid = false;
					return "Use input like YYYY-MM-DD";
				},
			],
			emailRules: [
				(email) => !!email || "Email is required",
				(email) => {
					let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
					return reg.test(email) || "Email is not valid";
				},
			],
			headersCustomers: [
				{ text: "Name", value: "name", align: "start" },
				{ text: "Surname", value: "surname" },
				{ text: "Email", value: "email", sortable: false },
				{ text: "Phone #", value: "phone", sortable: false },
				{ text: "Book Description", value: "bookDescription", sortable: false },
				{ text: "Book Price (R)", value: "bookPrice", sortable: false },
				{ text: "Purchase Date", value: "purchaseDate" },
				{ text: "ISBN", value: "isbn", sortable: false },
				{ text: "Actions", value: "actions", sortable: false },
			],
			dialog: false,
			dialogDelete: false,
			editedIndex: -1,
			editedCustomer: {
				name: "",
				surname: "",
				email: "",
				phone: "",
				bookDescription: "",
				bookPrice: 0,
				purchaseDate: "",
				isbn: "",
			},
			defaultCustomer: {
				name: "",
				surname: "",
				email: "",
				phone: "",
				bookDescription: "",
				bookPrice: 0,
				purchaseDate: "",
				isbn: "",
			},
		};
	},
	computed: {
		...mapGetters(["loading", "customers", "error"]),
		formTitle() {
			return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
		},
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
	},
	methods: {
		handleCustomers() {
			// getter from vuex
			this.$store.dispatch("getCustomers");
		},
		handleAddCustomer() {
			// if (this.$refs.form.validate()) {
			this.$store.dispatch("addCustomer", this.editedCustomer);
			// }
		},
		handleUpdateCustomer() {
			// if (this.$refs.form.validate()) {
			console.log("[updateCustomer]");
			this.$store.dispatch("updateCustomer", this.editedCustomer);
			// }
		},
		handleDeleteCustomer() {
			this.$store.dispatch("deleteCustomer", this.editedCustomer);
		},
		newItem(item) {
			this.editedIndex = -1;
			this.editedCustomer = Object.assign({}, item);
			this.dialog = true;
		},
		editItem(item) {
			this.editedIndex = this.customers.indexOf(item);
			this.editedCustomer = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			this.editedIndex = this.customers.indexOf(item);
			this.editedCustomer = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItemConfirm() {
			this.handleDeleteCustomer();
			this.closeDelete();
		},

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedCustomer = Object.assign({}, this.defaultCustomer);
				this.editedIndex = -1;
			});
		},

		closeDelete() {
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.editedCustomer = Object.assign({}, this.defaultCustomer);
				this.editedIndex = -1;
			});
		},

		save() {
			if (this.editedIndex > -1) {
				this.handleUpdateCustomer();
			} else {
				this.handleAddCustomer();
			}
			this.close();
		},
	},
};
</script>