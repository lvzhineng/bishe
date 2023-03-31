package com.silk.controller;

import com.silk.entity.User;
import com.silk.framework.jwt.JwtUtil;
import com.silk.service.UserService;
import com.silk.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @author LindaSilk
 * @date 2021年3月09日, 周二
 */
@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    //  从前端传入的JSON中获取对象信息
    public Result login(@RequestBody User user) {

        User entity = userService.login(user.getUserName(), user.getUserPwd(), user.getUserType());
        if (entity != null) {
            String token = JwtUtil.sign(entity);
            Map map = new HashMap();
            map.put(JwtUtil.token, token);
            map.put("user", entity);
            return Result.ok("登录成功", map);
        } else {
            return Result.fail("用户名或密码或角色错误");
        }
    }

    @PostMapping("/wxpasswordRset")
    public Result passwordReset(HttpServletRequest request, @RequestBody User user) {
        String token = request.getHeader(JwtUtil.token);
        User user1 = JwtUtil.getUser(token);             // 根据token获取用户对象
        if (!StringUtils.hasText(user.getUserPwd())) {
            return Result.fail();
        }
        user1.setUserPwd(user.getUserPwd());
        userService.updateSelective(user1);
        return Result.ok("修改成功");
    }
}
