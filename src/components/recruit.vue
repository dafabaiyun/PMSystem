<template>
    <div>
        <!-- <div class="search">
            <el-form :model="form" label-width="auto" style="max-width: 1200px">
                <el-form-item label="岗位名称">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-select v-model="form.location" placeholder="请选择工作地点">
                        <el-option label="上海" value="shanghai" />
                        <el-option label="北京" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="最高学历">
                    <el-select v-model="form.education" placeholder="请选择最高学历">
                        <el-option label="高中" value="high_school" />
                        <el-option label="本科" value="bachelor" />
                        <el-option label="硕士" value="master" />
                        <el-option label="博士" value="doctorate" />
                    </el-select>
                </el-form-item>
                <el-form-item class="footer">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <!-- <el-divider /> -->
        <div class="table">
            <el-table :data="tableData" v-loading="load">
                <el-table-column prop="recJob" label="岗位" width="120" />
                <el-table-column prop="recDep" label="部门" width="80" />
                <el-table-column prop="recNum" label="人数" width="80" />
                <el-table-column prop="recDest" label="工作地点" width="80" />
                <el-table-column prop="recRequest" label="招聘要求" width="350" />
                <el-table-column prop="pubTime" label="发布时间" width="200" />
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openDialog(scope.row.recNo)">
                            投递简历
                        </el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="投递数据" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openDrawer(scope.row.recNo)">
                            查看
                        </el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="100" class="pagination" />
        </div>
        <el-dialog v-model="dialogVisible" title="请输入简历信息" width="500" :before-close="cancel">
            <el-form :model="recruitForm" label-width="70px" style="max-width: 1200px" class="resumeDialog">
                <el-form-item label="姓名">
                    <el-input v-model="recruitForm.resName" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model.number="recruitForm.resAge" type="number" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="recruitForm.resSex" placeholder="请选择性别">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="recruitForm.rnative" placeholder="请输入籍贯" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="recruitForm.resPhone" placeholder="请输入联系方式" />
                </el-form-item>
                <el-form-item label="最高学历">
                    <el-select v-model="recruitForm.resEdu" placeholder="请选择最高学历">
                        <el-option label="专科" value="专科" />
                        <el-option label="本科" value="本科" />
                        <el-option label="硕士" value="硕士" />
                        <el-option label="博士" value="博士" />
                    </el-select>
                </el-form-item>
                <el-form-item label="实习经历">
                    <el-input type="textarea" v-model="recruitForm.experience" placeholder="请输入实习经历" />
                </el-form-item>
                <el-form-item label="证书技能">
                    <el-input type="textarea" v-model="recruitForm.skill" placeholder="请输入证书和技能" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- <el-drawer v-model="drawer" size="70%" title="投递数据" :direction="direction" :before-close="handleClose">
            <el-table :data="resumeData" style="width: 100%">
                <el-table-column prop="resName" label="姓名" width="120" />
                <el-table-column prop="resAge" label="年龄" width="120" />
                <el-table-column prop="resSex" label="性别" width="80" />
                <el-table-column prop="resPhone" label="联系电话" width="120" />
                <el-table-column prop="resEdu" label="最高学历" width="80" />
                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="showResume(scope.row.recNo)">
                            查看简历
                        </el-button>
                        <el-button link type="primary" size="small" @click="openDrawer(scope.row.recNo)">
                            添加面试信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
        <div class="demo-image__preview">
            <el-image-viewer style="width: 100px; height: 100px" :src="url" :zoom-rate="1.2" :max-scale="7"
                :min-scale="0.2" :url-list="[url]" v-if="previewImg" :on-close="closeViewer" :hide-on-click-modal="true"
                fit="cover" />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { getResume, getResumeFile } from '@/api/user';
import { onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { getAllRecruit, addResume } from '@/api/resume';
import { ElMessage } from 'element-plus'
const { user } = useUserStore()
const form = reactive({
    name: '',
    location: '',
    surname: '',
    age: '',
    gender: '',
    contact: '',
    education: '',
    resumeLink: ''
});
const recruitForm = reactive({
    ...getRecruit()
})
function getRecruit() {
    return {
        resName: '',
        resAge: null, // 使用null表示未输入年龄
        resSex: '',
        rnative: '',
        resPhone: '',
        resEdu: '',
        experience: '',
        skill: '',
        recNo: null,
    }
}
const load = ref(false);
const drawer = ref(false);

const tableData = ref([]);
const resumeData = ref([
    {
        resNo: 1,
        resAge: 23,
        resName: '小明',
        resSex: '男',
        resPhone: '12345665432',
        resEdu: '本科'
    }, {
        resNo: 1,
        resAge: 23,
        resName: '小明',
        resSex: '男',
        resPhone: '12345665432',
        resEdu: '本科'
    }, {
        resNo: 1,
        resAge: 23,
        resName: '小明',
        resSex: '男',
        resPhone: '12345665432',
        resEdu: '本科'
    },
])
onMounted(async () => {
    await fetchData() //记得恢复数据
})
async function fetchData() {
    load.value = true;
    tableData.value = await getAllRecruit();
    console.log(tableData.value);
    load.value = false;
}
const openDrawer = async (recNo) => {
    drawer.value = true;
    // resumeData.value=await getResume(recNo); //记得恢复数据
};

const search = () => {
    // 实现搜索逻辑  
    console.log('Searching with:', form);
};

const reset = () => {
    // 重置表单  
    form.name = '';
    form.location = '';
    form.surname = '';
    form.age = '';
    form.gender = '';
    form.contact = '';
    form.education = '';
    form.resumeLink = '';
};
const direction = ref('rtl')
function handleClose() {
    drawer.value = false
}
const url = ref('./assets/loginBg.jpg')
const previewImg = ref()
async function showResume(recNo) {
    console.log(previewImg.value);

    // const {resAttach}=await getResumeFile(recNo); //记得恢复数据
    previewImg.value = true;
    // url.value=resAttach; //记得恢复数据
}
const dialogVisible = ref(false);
function openDialog(recNo) {
    recruitForm.recNo = recNo;
    dialogVisible.value = true;
}
function CloseDialog() {
    dialogVisible.value = false;
}
async function submit() {
    console.log(JSON.stringify(recruitForm));

    const res = await addResume(recruitForm) //提交简历接口
    if (res.success) {
        ElMessage({
            message: '提交成功！',
            type: 'success',
        });
        Object.assign(recruitForm, getRecruit());
        console.log("recruitForm:" + recruitForm);

        dialogVisible.value = false;
    } else {
        ElMessage({
            message: '提交失败！请重试',
            type: 'error',
        });
    }

}
function cancel() {
    Object.assign(recruitForm, getRecruit());
    dialogVisible.value = false;

}
</script>

<style scoped>
.search {
    margin-top: 20px;
}

.el-form {
    /* display: flex;
    flex-flow: row wrap;
    align-items: center; */
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(390px, 460px)) !important;
    padding: 16px;
}

/deep/ .el-form-item__content {
    justify-content: flex-end;

}

/* /deep/ .el-form .el-button {
    margin-left: 310px;
} */

/deep/ .el-form-item__content {
    width: 300px;
    margin-right: 20px;
    justify-content: flex-end;

}

/* /deep/ .el-table .el-table__cell{
    text-align: center;
} */
.add {
    float: right;
    margin-bottom: 20px;
}

.pagination {
    float: right;
    margin-top: 20px;
}

/deep/ .resumeDialog .el-form-item__content {
    width: 100%;
}

/deep/ .el-dialog__footer {
    padding-top: 0;
}

/deep/ .cell {
    text-align: center;
}
</style>