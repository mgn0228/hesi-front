package com.test.front.hesi.config;

import com.test.front.hesi.interceptor.CommInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${backend-url}")
    private String backendUrl;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CommInterceptor(backendUrl))
            .addPathPatterns("/**")
            .excludePathPatterns("/")
            .excludePathPatterns("/log**/**")
            .excludePathPatterns("/find/**")
            .excludePathPatterns("/assets/**")
        ;
    }
}