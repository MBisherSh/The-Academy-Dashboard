import axios from 'axios';

const deleteItem = async ({ url, accessToken, query }) => {
	try {
		return await axios.delete(url, {
			params: query,
			headers: {
				Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
			},
		});
	} catch (error) {
		return { error };
	}
};

const get = async (url, accessToken, query) => {
	try {
		return await axios.get(url, {
			params: query,
			headers: {
				Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
			},
		});
	} catch (error) {
		return { error };
	}
};

const post = async ({ url, data, accessToken, query, formData }) => {
	try {
		return await axios.post(url, data, {
			params: query,
			headers: {
				'Content-Type': formData ? 'multipart/form-data' : 'application/json',
				Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
			},
		});
	} catch (error) {
		return { error };
	}
};

const patch = async ({ url, data, accessToken, query, formData }) => {
	try {
		return await axios.patch(url, data, {
			params: query,
			headers: {
				'Content-Type': formData ? 'multipart/form-data' : 'application/json',
				Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
			},
		});
	} catch (error) {
		return { error };
	}
};

const Axios = { get, post, patch, delete: deleteItem };
export default Axios;
