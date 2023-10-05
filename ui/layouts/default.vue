<template>
    <div class="wrapper">

        <GlobalSidebar></GlobalSidebar>

        <div class="main-panel">
            <GlobalHeader></GlobalHeader>
            <slot></slot>
            <GlobalFooter></GlobalFooter>
        </div>
    </div>
</template>