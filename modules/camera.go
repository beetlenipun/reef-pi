package modules

import (
	log "github.com/Sirupsen/logrus"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type CameraWorker struct {
	ticker            *time.Ticker
	quitCh            chan struct{}
	ImageDirectory    string
	RaspiStillCommand string
	CaptureFlags      string
}

const (
	DefaulCaptureFlags = ""
)

func NewCameraWorker(imageDirectory string, tickInterval time.Duration) *CameraWorker {
	return &CameraWorker{
		ticker:         time.NewTicker(tickInterval * time.Second),
		quitCh:         make(chan struct{}),
		ImageDirectory: imageDirectory,
		CaptureFlags:   DefaulCaptureFlags,
	}
}

func (w *CameraWorker) On() {
	log.Info("Starting camera module")
	for {
		select {
		case <-w.ticker.C:
			w.takeStill()
		case <-w.quitCh:
			w.ticker.Stop()
			return
		}
	}
}

func (w *CameraWorker) takeStill() {
	imageDir, pathErr := filepath.Abs(w.ImageDirectory)
	if pathErr != nil {
		log.Errorln(pathErr)
		return
	}
	filename := filepath.Join(imageDir, time.Now().Format("15-04-05-Mon-Jan-2-2006.png"))
	command := "raspistill -e png " + w.CaptureFlags + " -o " + filename
	parts := strings.Fields(command)
	cmd := exec.Command(parts[0], parts[1:]...)
	err := cmd.Run()
	if err != nil {
		log.Errorln(err)
		return
	}
	log.Infoln("Snapshot captured: ", filename)
	latest := filepath.Join(imageDir, "latest.png")
	os.Remove(latest)
	if err := os.Symlink(filename, latest); err != nil {
		log.Errorln(err)
	}
}

func (w *CameraWorker) Off() {
	w.quitCh <- struct{}{}
}