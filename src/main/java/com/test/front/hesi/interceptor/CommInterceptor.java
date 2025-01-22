package com.test.front.hesi.interceptor;

import com.test.front.hesi.external.ExternalAPI;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class CommInterceptor implements HandlerInterceptor {

    private final String backendUrl;

    public CommInterceptor(String backendUrl) {
        this.backendUrl = backendUrl;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        ExternalAPI externalAPI = new ExternalAPI();
        HttpSession session = request.getSession(true);

        // 토큰 검증
        boolean isTokenValid = externalAPI.checkToken(request, backendUrl);

        if(!isTokenValid) {
            // 토큰이 검증 실패시 401 에러 저장 후 로그인으로 이동
            session.setAttribute("statusCode", HttpStatus.UNAUTHORIZED);
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }

        // 나의 프로젝트 목록 조회
        // 지금은 그냥 call API 사용해서 불러오게 해놨음
        //JSONArray projectList = externalAPI.getProjectList(request, backendUrl);
        //request.setAttribute("projectList",projectList);

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }
}