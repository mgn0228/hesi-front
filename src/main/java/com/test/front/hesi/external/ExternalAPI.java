package com.test.front.hesi.external;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

public class ExternalAPI {

    /*
     * before : 프론트(react) 소스에서 모든 페이지마다 백엔드API 통신 및 검증
     * after  : 인터셉터를 이용하여 페이지 들어가기 전 프론트-백엔드에서 백엔드API 통신 및 검증
     */

    public boolean checkToken(HttpServletRequest request, String backendUrl) {
        /* 토큰 검증 로직 */
        HttpSession session = request.getSession(true);
        Object token = session.getAttribute("accessToken");

        if(Objects.isNull(token)) {
            // 토큰이 없거나 빈 값이면
            return false;

        }else {
            // 토큰이 있으면
            token = token.toString();
            String url = backendUrl + "/user/check/not-expired";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("application","json", StandardCharsets.UTF_8));
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            try {
                // 현재 토큰 검사 (컨스퀘어 사용자 백엔드와 API 통신)
                RestTemplate restTemplate = new RestTemplate();

                ResponseEntity<String> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
                );

                JSONParser parser = new JSONParser();
                JSONObject jsonObject = (JSONObject) parser.parse(responseEntity.getBody());

                // 토큰 검증 결과가 data 안에 boolean으로 나옴
                return (Boolean) jsonObject.get("data");

            }catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    public JSONArray getProjectList(HttpServletRequest request, String backendUrl) {
        /* 토큰 검증 로직 */
        HttpSession session = request.getSession(true);

        String token = String.valueOf(session.getAttribute("accessToken"));
        long companyId = Long.parseLong(String.valueOf(session.getAttribute("companyId")));

        String url = backendUrl + "/project/list/"+companyId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application","json", StandardCharsets.UTF_8));
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 현재 토큰 검사 (컨스퀘어 사용자 백엔드와 API 통신)
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );

            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(responseEntity.getBody());

            return (JSONArray) jsonObject.get("data");

        }catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
