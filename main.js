/**
 * 1. Render songs !
 * 2. Scroll tops !
 * 3. Play / Pause / Seek !      HTML Audio/Video DOM References
 * 4. CD rotate !
 * 5. Next / prev !
 * 6. Random !
 * 7. Next / Repeat when ended !
 * 8. Active song !
 * 9. Scroll active song into view !
 * 10. Play song when click  !
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'


const playlist = $('.playlist')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



const apps = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Tourist',
            singer: 'B Wine, V#',
            path: './musics/Tourist-BWine-7066630.mp3',
            image: './images/tourist.jpg'
        },
        {
            name: 'Laviai',
            singer: 'HIEUTHUHAI, HURRYKNG',
            path: './musics/Laviai-HIEUTHUHAIKNG-6408303.mp3',
            image: './images/Laviai.jpeg'
        },
        {
            name: 'The Last Finale',
            singer: 'B Ray',
            path: './musics/TheLastFinale-BRay-7044287.mp3',
            image: './images/the last finale.jpg'
        },
        {
            name: 'Bật Nhạc Lên',
            singer: 'HIEUTHUHAI, Harmonie',
            path: './musics/BatNhacLen1-HIEUTHUHAIHarmonie-6351919.mp3',
            image: './images/batnhaclen.jpg'
        },
        {
            name: 'Spiderman',
            singer: 'B Wine',
            path: './musics/Spiderman-BWine-5163981.mp3',
            image: './images/spiderman.jpg'
        },
        {
            name: 'I Don\'t Want You Back',
            singer: 'Young H, B Ray',
            path: './musics/IDontWantYouBack-YoungHBRay-4305658.mp3',
            image: './images/dontback.jpg'
        },
        {
            name: 'From The Ghetto',
            singer: 'B Wine',
            path: './musics/FromTheGhetto-BWine-2619175.mp3',
            image: './images/ghetto.jpg'
        },
        {
            name: '100 Questions',
            singer: 'B Ray, V#',
            path: './musics/100Questions-VBRay-5161736_hq.mp3',
            image: './images/100 questions.jpg'
        },
        {
            name: 'Paper Heart',
            singer: 'Young H, Quynh Anh',
            path: './musics/PaperHeart-YoungHQuynhAnh-4019727.mp3',
            image: './images/paperheart.jpg'
        },
        {
            name: 'Truyện Tranh',
            singer: 'B Ray',
            path: './musics/TruyenTranh-BRay-5199124.mp3',
            image: './images/comic.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                    style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth


        // Xử lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.currentTime / audio.duration * 100) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý khi bấm nút next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý khi bấm nút prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        // xu li khi bam nut Random bai hat
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xu li lap lai mot bai hat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xu li next song khi bai hat ket thuc
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // lang nghe hanh vi click vao playlick
        playlist.onclick = function() {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                // xu li khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                // xu li khi click vao song option
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom 
        this.isRepeat = this.config.isRepeat 
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // gan cau hinh tu config vao ung dung
        this.loadConfig()
        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe xử lí sự kiện
        this.handleEvent()

        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()

        // hien thi trang thai ban dau cua button repeat va random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

apps.start()



