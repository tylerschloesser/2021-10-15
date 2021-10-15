console.log('hi')
const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height
canvas.width = rect.width

context.fillStyle = 'grey'
context.fillRect(0, 0, canvas.width, canvas.height)
