const users = ["John", "Mike", "Alex"];

export const MIN_USER_ID = 0;
export const MAX_USER_ID = users.length - 1;

export const getUserById = (user_id: number) => {
  return {
    name: users[user_id],
    user_id,
  };
};

export const listUsers = () => {
  return users.map((name, user_id) => ({
    name,
    user_id,
  }));
};
