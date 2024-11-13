import { defineStore } from "pinia";
import { getUserRole, userLoginServe } from "../api/user";
import { ref } from "vue";
export const useUserStore = defineStore(
  "userStore",
  () => {
    // const user = ref({});
    const user = ref({
      roleList: [], // 初始化为空数组
    });
    async function loginFunc({ userid, psw }) {
      console.log("loginFunc", userid, psw);
      const res = await userLoginServe({ userid, psw });
      // 检查返回的 response 是否包含 data 字段，并且 data 是布尔值 true
      if (res.success) {
        Object.assign(user.value, { userid});
        const role = await getUserRole(userid); // 获取角色数据
        console.log("User role data:", role.data);
        role.data && Object.assign(user.value, { roleList: role.data.roleList});
        console.log("user:", user.value);

        
      }
      return res;
    }

    function setRole(role) {
      user.value["role"] = role;
    }
    return {
      user,
      loginFunc,
      setRole,
    };
  },
  {
    persist: true,
  }
);
