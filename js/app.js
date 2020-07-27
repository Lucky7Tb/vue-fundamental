Vue.component('card', {
    props: ["text", "urlVideo"],
    data(){
        return{
            start: this.urlVideo,
            youtubeVideoId: "Wy9q22isx3U"
        }
    },
    methods:{
        url(){
            return `https://www.youtube.com/embed/${this.youtubeVideoId}?start=${this.start}`;
        }
    },
    template: `
    <div class="card">
        <div class="card-image">
            <iframe 
                style="width:100%"
                id="ytplayer"
                type="text/html"
                height="250"
                :src="url()"
                frameborder="0"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen" 
                msallowfullscreen="msallowfullscreen" 
                oallowfullscreen="oallowfullscreen" 
                webkitallowfullscreen="webkitallowfullscreen"
            >
            </iframe>        
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-left is-hidden-tablet-only">
                    <figure class="image is-48x48">
                        <img src="https://cdn.svgporn.com/logos/youtube.svg" alt="YoutubeLogo">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">Travesi Media</p>
                    <p class="subtitle is-6">Vue js Crash Course</p>
                </div>
            </div>
        </div>
        <div class="content">
            <p v-html="text"></p>
        </div>
    </div>
    `
})

new Vue({
    el: "#app",
    data:{
        apiEndPoint: "https://cari-teks-video-api.vercel.app/api/search",
        youtubeUrl: "https://www.youtube.com/watch?v=Wy9q22isx3U",
        isPreLoaderShow: false,
        search:{
            searchForm: "",
            searchError: false,
            searchErrorText: ""
        },
        data: [],
        pagination:{
            firstPage: null,
            lastPage: null,
            previousPage: null,
            nextPage: null,
            totalPage: 0,
            page: null
        }
    },
    methods:{
        searchKeyWord(){
            this.data = [];
            if(this.search.searchForm.length < 3){
                this.search.searchError = !this.search.searchError;
                this.search.searchErrorText = "Field minimal 3 karakter";
            }else{ 
                this.searchVideo();
            }
        },
        async searchVideo(page){
            this.data = [];
            this.isPreLoaderShow = !this.isPreLoaderShow;
            try {
                const dirtyResult = await fetch(page ? this.pagination[page] : `${this.apiEndPoint}?url=${encodeURIComponent(this.youtubeUrl)}&q=${this.search.searchForm}&size=4`);
                const result = await dirtyResult.json();
                this.data = result.data;
                this.pagination.firstPage = result.first;
                this.pagination.lastPage = result.last;
                this.pagination.nextPage = result.next;
                this.pagination.previousPage = result.prev;
                this.pagination.page = result.page;
                this.pagination.totalPage = result.total;
            } catch (error) {
                !this.search.searchError;
                this.search.serachErrorText = "Terjadi Kesalahan pada server";
            }finally{
                this.isPreLoaderShow = !this.isPreLoaderShow;
            }
        },
        clear(){
            this.isPreLoaderShow = false;
            this.search.searchForm = "";
            this.search.searchError = false;
            this.search.searchErrorText = "";
            this.data = [];
            this.pagination.firstPage = null;
            this.pagination.lastPage = null
            this.pagination.previousPage = null;
            this.pagination.nextPage = null;
            this.pagination.totalPage = 0;
            this.pagination.page = null
        }
    }
})