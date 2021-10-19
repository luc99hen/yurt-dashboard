package main

import (
	"fmt"
	"net/http"
	"strings"
	client "yurt_console_backend/k8s_client"

	"github.com/gin-gonic/gin"
)

func getNodeHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawNode)
}

func getDeploymentHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawDeployment)
}

func getStatefulsetHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawStatefulset)
}

func getJobHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawJob)
}

func getNodepoolHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawNodepool)
}

func getPodHandler(c *gin.Context) {
	proxyRequest(c, client.GetRawPod)
}

func getClusterOverviewHandler(c *gin.Context) {

	kubeConfig, namespace, err := parseResourceParas(c)
	if err != nil {
		JSONErr(c, http.StatusBadRequest, err.Error())
	}

	clusterStatus, err := client.GetClusterOverview(kubeConfig, namespace)
	if err != nil {
		JSONErr(c, http.StatusServiceUnavailable, err.Error())
		return
	}

	c.JSON(http.StatusOK, clusterStatus)

}

func loginHandler(c *gin.Context) {

	submitUser := struct {
		MobilePhone string
		Token       string
	}{}
	if err := c.BindJSON(submitUser); err != nil {
		return // parse failed, then abort
	}

	fetchUser, err := client.GetUser(adminKubeConfig, submitUser.MobilePhone)
	if err != nil { // fetch user failed
		JSONErr(c, http.StatusInternalServerError, err.Error())
	}

	// testify if user token is valid
	if strings.TrimSpace(fetchUser.Spec.Token) != strings.TrimSpace(submitUser.Token) {
		JSONErr(c, http.StatusBadRequest, "phoneNumber or token is invalid")
	}

	c.JSON(http.StatusOK, fetchUser)
}

func registerHandler(c *gin.Context) {

	userProfile := client.UserSpec{}
	if err := c.BindJSON(userProfile); err != nil {
		return // parse failed, then abort
	}

	// create user obj
	err := client.CreateUser(adminKubeConfig, userProfile)
	if err != nil {
		JSONErr(c, http.StatusBadRequest, fmt.Sprintf("register: create user fail: %v", err))
	}

	// get created user
	createdUser, err := client.GetUser(adminKubeConfig, userProfile.Mobilephone)
	if err != nil {
		JSONErr(c, http.StatusBadRequest, fmt.Sprintf("register: get created user fail: %v", err))
	}

	c.JSON(http.StatusOK, createdUser)

}
