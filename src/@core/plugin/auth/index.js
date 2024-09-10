import axios from "axios";
import * as _storage from "./storage"
import router from "../../../router"

const jwt = require("jsonwebtoken");

export class Auth {
    constructor({ endPoints, redirects }) {
        this.endPoints = endPoints
        this.redirects = redirects
    }

    async login(user) {
        const { status, data } = await axios({ method: "post", url: `/api/identityprovider/v1/${this.endPoints.login}`, data: user });
        if (status == 200) {
            const role = this.tokenParser(data["accessToken"]).payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
            if (role !== "SuperAdmin") {
                return null;
            } else {
                _storage.setStorage("token", `Bearer ${data["accessToken"]}`);
                _storage.setStorage("refresh", data["refreshToken"]);
                this.setExpiration("tokenExp", this.tokenParser(data["accessToken"]).payload.exp);
                // this.setExpiration("refreshExp", this.tokenParser(data["refreshToken"]).payload.exp);
                this.getUser();
                return { status, data }
            }
        } else {
            return { status, data }
        }
    }
    async getUser() {
        const config = {
            Authorization: _storage.getStorage("token") || "",
        };
        const { data } = await axios.get(`/api/identityprovider/v1/${this.endPoints.user}`, config);
        localStorage.setItem("user", JSON.stringify({ ...data }))
    }
    // async refreshToken() {
    //     const { status, data } = await axios.post(`/api/identityprovider/v1/${this.endPoints.refresh}`, { refreshToken: _storage.getStorage("refresh") });
    //     if (status === 200) {
    //         _storage.setStorage("token", `Bearer ${data["accessToken"]}`);
    //         _storage.setStorage("refresh", data["refreshToken"]);
    //         this.setExpiration("tokenExp", this.tokenParser(data["accessToken"]).payload.exp);
    //         this.setExpiration("refreshExp", this.tokenParser(data["refreshToken"]).payload.exp);
    //         return { status, token: `Bearer ${data["accessToken"]}` };
    //         // },1500)
    //     } else if (status === 401 || status === 500) {
    //         return { status };
    //     }
    // }
    async logout() {
        // await ['token','refresh'].forEach((pr)=>{
        _storage.clearStorage();
        // })
        router.push(this.redirects.logout);
    }
    checkExpiration(token) {
        const now = Math.trunc(Date.now() / 1000);
        const expTime = +_storage.getStorage(token) || 0;
        return now > expTime;
    }

    loggedInUser() {
        return !this.checkExpiration("refreshExp") && !!_storage.getStorage("token");
    }

    redirect(isLogin) {
        isLogin ? router.push("/") : router.push("/login");
    }

    //Manage token this section
    tokenParser(token) {
        return jwt.decode(token, { complete: true });
    }

    setExpiration(key, value) {
        _storage.setStorage(key, value);
    }
}
export default {
    install: (app, options) => {
        app.config.globalProperties.$auth = new Auth(options);
    },
};
