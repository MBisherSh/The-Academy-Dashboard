const restrictToPermission = (permission, permissions, user) => {
	return !permissions[permission]?.roles.find((r) => r._id === user.role);
};

export default restrictToPermission;
