import "dotenv/config";

export const ENV = {
	DB_URL: process.env.DB_URL ?? "",
	TOUTBOX_BASE_URL: process.env.TOUTBOX_BASE_URL ?? "",
	TOUTBOX_B2B_API_KEY: process.env.TOUTBOX_B2B_API_KEY ?? "",
	TOUTBOX_B2C_API_KEY: process.env.TOUTBOX_B2C_API_KEY ?? "",
	COLETAS_API_URL: process.env.COLETAS_API_URL ?? "",
	COLETAS_API_USERNAME: process.env.COLETAS_API_USERNAME ?? "",
	COLETAS_API_PASSWORD: process.env.COLETAS_API_PASSWORD ?? "",
};
