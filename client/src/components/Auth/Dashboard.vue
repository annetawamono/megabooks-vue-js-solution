<template>
	<v-container mt-5>
		<v-layout row>
			<v-flex>
				<h1>Dashboard</h1>
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

		<!-- <v-layout mt-5>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						Customers
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<v-data-table
						:headers="headersCustomers"
						:items="customers"
						:search="search"
					></v-data-table>
				</v-card>
			</v-flex>
		</v-layout> -->

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
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedCustomer.name"
												label="Customer name"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedCustomer.surname"
												label="Surname"
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
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedCustomer.bookPrice"
												label="Book Price"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedCustomer.purchaseDate"
												label="Purchase date"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedCustomer.isbn"
												label="ISBN"
											></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">
									Cancel
								</v-btn>
								<v-btn color="blue darken-1" text @click="save"> Save </v-btn>
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
			desserts: [],
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
		...mapGetters(["loading", "customers"]),
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
			// form validation
			// add customer action
			this.$store.dispatch("addCustomer", this.editedCustomer);
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
			this.desserts.splice(this.editedIndex, 1);
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
				// update customer
				Object.assign(this.desserts[this.editedIndex], this.editedCustomer);
			} else {
				this.handleAddCustomer();
				// this.desserts.push(this.editedCustomer);
			}
			this.close();
		},
	},
};
</script>