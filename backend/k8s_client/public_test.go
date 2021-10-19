package client

import (
	"errors"
	"testing"

	kerrors "k8s.io/apimachinery/pkg/api/errors"
)

var kubeConfig = GetKubeConfigString("./kubeconfig.conf")

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

func TestUser(t *testing.T) {

	t.Run("post existing user", func(t *testing.T) {

		err := CreateUser(kubeConfig, UserSpec{
			Email:        "1",
			Mobilephone:  "2",
			Organization: "openyurt",
		})

		assertErrCode(err, 409, t)
	})

	t.Run("get user", func(t *testing.T) {
		_, err := GetUser(kubeConfig, "test")
		assertNoErr(err, t)
	})

	t.Run("get non-exist user", func(t *testing.T) {
		_, err := GetUser(kubeConfig, "test-non")
		assertErrCode(err, 404, t)
	})
}
