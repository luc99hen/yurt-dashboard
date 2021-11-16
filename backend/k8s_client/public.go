/*
public.go exposes out-of-the-box function used by proxy_server
*/
package client

import "fmt"

// get admin kubeconfg
func GetAdminKubeConfig() string {
	return kubeConfig
}

// get all Pods from a namespace
func GetRawPod(kubeConfig, namespace string) ([]byte, error) {
	return listRaw(kubeConfig, namespace, &PodConfig)
}

// get all deployments from a namespace
func GetRawDeployment(kubeConfig, namespace string) ([]byte, error) {
	return listRaw(kubeConfig, namespace, &DeploymentConfig)
}

// get nodes which belong to one user (based on the kubeconfig)
func GetRawNode(kubeConfig, namespace string) ([]byte, error) { // namespace is used for compatity
	return listRaw(kubeConfig, "", &NodeConfig)
}

// get statefulsets which belong to one user (based on the kubeconfig)
func GetRawStatefulset(kubeConfig, namespace string) ([]byte, error) {
	return listRaw(kubeConfig, namespace, &StatefulsetConfig)
}

// get all jobs from a namespace
func GetRawJob(kubeConfig, namespace string) ([]byte, error) {
	return listRaw(kubeConfig, namespace, &JobConfig)
}

// get all nodepool
func GetRawNodepool(kubeConfig, namespace string) ([]byte, error) { // namespace is used for compatity
	return listRaw(kubeConfig, "", &NodepoolConfig)
}

// get cluster overview
func GetClusterOverview(kubeConfig, namespace string) (res []*ResourceStatus, err error) {

	// initialize res
	res = make([]*ResourceStatus, 0)
	ch := make(chan *ResourceStatus)

	clientList := []ResourceClient{&PodClient{}, &NodeClient{}, &StatefulsetClient{}, &JobClient{}, &DeploymentClient{}}

	for _, client := range clientList {

		// assign each get task into one goroutine
		go func(client ResourceClient) {

			err := client.InitClient(kubeConfig)
			if err != nil {
				ch <- &ResourceStatus{
					Status: false,
					Info:   err.Error(),
				}
				return
			}

			status, err := client.GetStatus(namespace)
			if err != nil {
				ch <- &ResourceStatus{
					Status: false,
					Info:   err.Error(),
				}
				return
			}

			// push res into channel
			ch <- status
		}(client)
	}

	for i := 0; i < len(clientList); i += 1 {
		// read res from channel
		res = append(res, <-ch)
	}

	return res, nil
}

// get user by username
func GetUser(kubeConfig, phoneNumber string) (*User, error) {
	userClient := &UserClient{}
	err := userClient.InitClient(kubeConfig)
	if err != nil {
		return nil, fmt.Errorf("get user: init client fail: %w", err)
	}

	user, err := userClient.GetUser(fmt.Sprintf("user-%s", phoneNumber))
	return user, err
}

// Create User Obj
func CreateUser(kubeConfig string, user *UserSpec) (err error) {
	userClient := &UserClient{}
	err = userClient.InitClient(kubeConfig)
	if err != nil {
		return fmt.Errorf("create user: init client fail: %w", err)
	}

	err = userClient.CreateRaw(userStoreNS, createUser(user))
	if err != nil {
		return fmt.Errorf("create user: send request fail: %w", err)
	}

	return nil
}

// patch node
func PatchNode(kubeConfig string, nodeName string, patchData map[string]interface{}) ([]byte, error) {
	nodeClient := NodeClient{}
	err := nodeClient.InitClient(kubeConfig)
	if err != nil {
		return nil, fmt.Errorf("create nodeClient: init client fail: %w", err)
	}

	return nodeClient.Patch(nodeName, patchData)
}

// create deployment
func CreateDeployment(kubeConfig, namespace string, deployment interface{}) (err error) {
	deploymentClient := &DeploymentClient{}
	err = deploymentClient.InitClient(kubeConfig)
	if err != nil {
		return fmt.Errorf("create deployment: init client fail: %w", err)
	}

	err = deploymentClient.CreateRaw(namespace, deployment)
	if err != nil {
		return fmt.Errorf("create deployment: send request fail: %w", err)
	}

	return nil
}
