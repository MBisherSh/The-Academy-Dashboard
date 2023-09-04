const baseUrl = 'https://theacademyapi.scrollwebapps.com';
const Api = {
	login: baseUrl + '/auth/public/login',
	generalStatistics: baseUrl + '/user/statistics/general',
	paymentsStatistics: baseUrl + '/user/statistics/payments',
	permissions: baseUrl + '/user/public/permission',
	roles: baseUrl + '/user/public/role',
	createRole: baseUrl + '/user/role',
	deleteRole: baseUrl + '/user/role',
	createPermission: baseUrl + '/user/permission',
	updatePermission: baseUrl + '/user/permission',
	deletePermission: baseUrl + '/user/permission',
	generals: baseUrl + '/user/public/setting',
	updateGeneral: baseUrl + '/user/setting',
	transactions: baseUrl + '/user/transaction',
	users: baseUrl + '/user/user-list',
	createTransaction: baseUrl + '/user/transaction',
	updateUserRole: baseUrl + '/user/set-role',
	categories: baseUrl + '/course/public/category',
	category: baseUrl + '/course/public/category',
	createCategory: baseUrl + '/course/category',
	updateCategory: baseUrl + '/course/category',
	deleteCategory: baseUrl + '/course/category',
	subjects: baseUrl + '/course/public/subject',
	createSubject: baseUrl + '/course/subject',
	updateSubject: baseUrl + '/course/subject',
	deleteSubject: baseUrl + '/course/subject',
	allCourses: baseUrl + '/course/public',
	unacceptedCourses: baseUrl + '/course/unaccepted',
	acceptCourse: baseUrl + '/course/accept',
	setDefaultPermissions: baseUrl + '/user/set-permission-default',
	setDefaultRoles: baseUrl + '/user/set-role-default',
};
export default Api;