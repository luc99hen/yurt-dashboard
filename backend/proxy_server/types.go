package main

import client "yurt_console_backend/k8s_client"

type User struct {
	KubeConfig string `json:"kubeConfig"`
	Namespace  string `json:"namespace"`
}

var adminKubeConfig = client.GetAdminKubeConfig()
