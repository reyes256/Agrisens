// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app:  {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        { src: '/js/core/jquery.min.js'},
        { src: '/js/core/popper.min.js' },
        { src: '/js/core/bootstrap.min.js' },
        { src: '/js/plugins/perfect-scrollbar.jquery.min.js' },
        { src: '/js/plugins/chartjs.min.js' },
        { src: '/js/plugins/bootstrap-notify.js' },
        { src: '/js/black-dashboard.min.js?v=1.0.0' },
        { src: '/demo/demo.js' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800' },
        { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.6/css/all.css' },
        { rel: 'stylesheet', href: '/css/nucleo-icons.css' },
        { rel: 'stylesheet', href: '/css/black-dashboard.css?v=1.0.0' },
        { rel: 'stylesheet', href: '/demo/demo.css' },
      ]
    }
  }
})