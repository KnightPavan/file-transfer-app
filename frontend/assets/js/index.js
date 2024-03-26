const dropZone = document.querySelector('.drop-zone')
const fileInput = document.querySelector('#fileInput')
const browseBtn = document.querySelector('.browseBtn')

const progressContainer = document.querySelector('.progress-container')
const bgProgress = document.querySelector('.bg-progress')
const precentDiv = document.querySelector('#percent')
const progressBar = document.querySelector('.progress-bar')
const progressPercent = document.querySelector('#progressPercent')

const sharingContainer = document.querySelector('.sharing-container')
const fileURL = document.querySelector('#fileURL')
const copyURLBtn = document.querySelector('#copyURLBtn')
const emailForm = document.querySelector('#emailForm')

const toast = document.querySelector('.toast')

const host = 'https://file-transfer-app-u14q.onrender.com/'
const uploadURL = `${host}api/files`
const emailUrl = `${host}api/files/send`

const maxAllowedSize = 100 * 1024 * 1024

dropZone.addEventListener('dragover', e => {
  e.preventDefault()
  dropZone.classList.add('dragged')
})

dropZone.addEventListener('dragleave', e => {
  dropZone.classList.remove('dragged')
})

dropZone.addEventListener('drop', async e => {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileInput.files = files
      await uploadFile()
    } else {
      showToast('Max file size is 100MB')
    }
  } else if (files.length > 1) {
    showToast("You can't upload multiple files")
  }
  dropZone.classList.remove('dragged')
})

fileInput.addEventListener('change', async e => {
  e.preventDefault()
  if (fileInput.files[0].size > maxAllowedSize) {
    showToast('Max file size is 100MB')
    fileInput.value = ''
    return
  }
  uploadFile()
})

copyURLBtn.addEventListener('click', () => {
  fileURL.select()
  document.execCommand('copy')
  showToast('Copied to clipboard')
})

browseBtn.addEventListener('click', e => {
  fileInput.click()
})

const uploadFile = async () => {
  const file = fileInput.files[0]
  const formData = new FormData()
  formData.append('myfile', file)
  progressContainer.style.display = 'block'

  const xhr = new XMLHttpRequest()

  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      onFileUploadSuccess(xhr.responseText)
    }
  }

  xhr.upload.onprogress = e => {
    let percent = Math.round((e.loaded / e.total) * 100)
    progressPercent.innerText = percent
    const scaleX = `scaleX(${percent / 100})`
    bgProgress.style.transform = scaleX
    progressBar.style.transform = scaleX
  }

  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`)
    fileInput.value = ''
  }

  xhr.open('POST', uploadURL)
  xhr.send(formData)
}

const onFileUploadSuccess = res => {
  fileInput.value = '' 

  emailForm[2].removeAttribute('disabled')
  emailForm[2].innerText = 'Send'
  progressContainer.style.display = 'none'

  const { file: url } = JSON.parse(res)
  sharingContainer.style.display = 'block'
  fileURL.value = url
}

emailForm.addEventListener('submit', e => {
  e.preventDefault()
  const url = fileURL.value

  const formData = {
    uuid: url.split('/').splice(-1, 1)[0],
    emailTo: emailForm.elements['to-email'].value,
    emailFrom: emailForm.elements['from-email'].value
  }
  emailForm[2].setAttribute('disabled', 'true')

  fetch(emailUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(res => {
      return res.json()
    })
    .then(({ success }) => {
      if (success) {
        showToast('Email Sent')
        sharingContainer.style.display = 'none'
      }
    })
})

let toastTimer

const showToast = msg => {
  clearTimeout(toastTimer)
  toast.innerText = msg
  toast.classList.add('show')
  toastTimer = setTimeout(() => {
    toast.classList.remove('show')
  }, 2000)
}
