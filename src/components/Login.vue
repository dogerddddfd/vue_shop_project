<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="logo">
            </div>
        </div>
    </div>
</template>

<script>
    export default{}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
    color:red;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        height: 130px;
        width: 130px;

        border: 1px solid rgb(190, 189, 189);
        border-radius: 50%;
        padding:10px;
        box-shadow:0 0 10px #ddd;
        background-color: #fff;
        img{
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background-color: rgb(190, 189, 189);
        }

        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>