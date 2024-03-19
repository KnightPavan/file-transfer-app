const dropZone = document.querySelector('.drop-zone')
const fileInput = document.querySelector('#fileInput')
const browseBtn = document.querySelector('.browseBtn')

const host = 'http://localhost:3000/'
const uploadURL = `${host}api/files`

dropZone.addEventListener('dragover', e => {
  console.log('dragging')
  e.preventDefault()
  if (!dropZone.classList.contains('dragged')) {
    dropZone.classList.add('dragged')
  }
})

dropZone.addEventListener('dragleave', e => {
  console.log('drag leave')
  dropZone.classList.remove('dragged')
})

dropZone.addEventListener('drop', e => {
  e.preventDefault()
  dropZone.classList.remove('dragged')
  //   console.log(e.dataTransfer.files);
  const files = e.dataTransfer.files
  if (files.length) {
    fileInput.files = files
    uploadFile()
  }
})

fileInput.addEventListener('change', e => {
  uploadFile()
})

browseBtn.addEventListener('click', e => {
  fileInput.click()
  console.log('clicked')
})

const uploadFile = async () => {
  const file = fileInput.files[0]
  const formData = new FormData()
  formData.append('myfile', file)

  try {
    const data = await fetch(
      uploadURL,
      {
        method: 'POST',
        body: formData
      },
      onprogress(progress => {
        console.log('progress')
        
      })
    )
    console.log('Uploaded')
  } catch (error) {
    console.log('Error when uploading file')
    return
  }
}
