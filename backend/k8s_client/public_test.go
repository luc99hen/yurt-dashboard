package client

import (
	"errors"
	"testing"

	kerrors "k8s.io/apimachinery/pkg/api/errors"
)

func assertNoErr(err error, t testing.TB) {
	t.Helper()
	if err != nil {
		t.Errorf(err.Error())
	}
}

func assertErrCode(err error, errCode int, t testing.TB) {
	t.Helper()

	// unwrap to get the original err
	err = errors.Unwrap(err)
	statusErr, isStatus := err.(*kerrors.StatusError)
	if err == nil {
		t.Errorf("expect %d got nothing", errCode)
		return
	}

	if !(isStatus && statusErr.ErrStatus.Code == int32(errCode)) {
		t.Errorf("expect %d got others, err: %v", errCode, err.Error())
	}
}

func TestGetRaw(t *testing.T) {
	t.Run("get jobs in kube-system", func(t *testing.T) {
		_, err := GetRawJob(kubeConfig, "kube-system")
		assertNoErr(err, t)
	})

	t.Run("get deployments in kube-system", func(t *testing.T) {
		_, err := GetRawDeployment(kubeConfig, "kube-system")
		assertNoErr(err, t)
	})

	t.Run("get nodepool", func(t *testing.T) {
		_, err := GetRawNodepool(kubeConfig, "")
		assertNoErr(err, t)
	})

}

func TestGetOverview(t *testing.T) {
	_, err := GetClusterOverview(kubeConfig, "kube-system")
	assertNoErr(err, t)
}

func TestPatchNode(t *testing.T) {

	patchData := map[string]interface{}{"metadata": map[string]map[string]string{"annotations": {
		"node.beta.alibabacloud.com/autonomy": "false",
	}}}
	nodeName := "node1"

	_, err := PatchNode(kubeConfig, nodeName, patchData)
	assertNoErr(err, t)
}

func TestUser(t *testing.T) {

	t.Run("post user format not allowed: invalid phonenumber", func(t *testing.T) {

		err := CreateUser(kubeConfig, &UserSpec{
			Email:        "132@qq.com",
			Mobilephone:  "+1",
			Organization: "Tongji",
		})

		assertErrCode(err, 422, t)
	})

	t.Run("post existing user", func(t *testing.T) {

		err := CreateUser(kubeConfig, &UserSpec{
			Email:        "132@qq.com",
			Mobilephone:  "1",
			Organization: "openyurt",
		})

		assertErrCode(err, 409, t)
	})

	t.Run("get user", func(t *testing.T) {
		_, err := GetUser(kubeConfig, "18321778186")
		assertNoErr(err, t)
	})

	t.Run("get non-exist user", func(t *testing.T) {
		_, err := GetUser(kubeConfig, "non")
		assertErrCode(err, 404, t)
	})
}
