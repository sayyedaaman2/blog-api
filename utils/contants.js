export const userRoles = {
  ADMIN: "admin",
  AUTHOR: "author",
  USER: "user",
  get values() {
    return [this.ADMIN, this.AUTHOR, this.USER];
  }
};
