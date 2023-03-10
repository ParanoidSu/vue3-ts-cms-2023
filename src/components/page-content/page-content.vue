<template>
	<div class="page-content">
		<div class="header">
			<h3 class="title">{{ props.contentConfig.header?.title ?? '数据列表' }}</h3>
			<div class="btn">
				<el-button type="primary" @click="createNewDepartmentClick" v-if="isCreate">{{
					props.contentConfig.header?.btnTitle ?? '新建数据'
				}}</el-button>
			</div>
		</div>
		<div class="table">
			<el-table :data="pageList" border style="width: 100%" v-bind="props.contentConfig.childrenProps">
				<template v-for="item in props.contentConfig.propsList" :key="item.prop">
					<template v-if="item.type === 'time'">
						<el-table-column v-bind="item" align="center">
							<template #default="{ row }">
								{{ formatUTC(row[item.prop]) }}
							</template>
						</el-table-column>
					</template>
					<template v-else-if="item.type === 'operation'">
						<el-table-column v-bind="item" align="center">
							<template #default="{ row }">
								<el-button size="small" type="primary" icon="Edit" @click="handleEditDeparmentInfo(row)" v-if="isUpdate"
									>编辑</el-button
								>
								<el-button
									size="small"
									type="danger"
									icon="Delete"
									@click="deleteDepartmentClick(row.id)"
									v-if="isDelete"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</template>
					<template v-else-if="item.type === 'slot'">
						<el-table-column v-bind="item" align="center">
							<template #default="scoped">
								<slot v-bind="scoped" :name="item.slotName" />
							</template>
						</el-table-column>
					</template>
					<template v-else>
						<el-table-column v-bind="item" align="center" />
					</template>
				</template>
			</el-table>
		</div>

		<div class="pagination">
			<div class="demo-pagination-block" v-if="props.contentConfig.pageName !== 'menu'">
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 20, 30]"
					layout="total, sizes, prev, pager, next, jumper"
					:total="+pageTotalCount"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import usesystemStore from '@/store/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { ref } from 'vue'
import usePermissions from '@/hooks/usePermissions'

interface IProps {
	contentConfig: {
		pageName: string
		header?: {
			title?: string
			btnTitle?: string
		}
		propsList?: any[]
		childrenProps?: any
	}
}

const props = defineProps<IProps>()

const systemStore = usesystemStore()
const currentPage = ref(1)
const pageSize = ref(10)

systemStore.$onAction(({ name, after }) => {
	after(() => {
		if (name === 'postPageListDataAction' || name === 'deletePageAction' || name === 'createPageDataAction') {
			currentPage.value = 1
		}
	})
})

fetchPageListData()

const isCreate = usePermissions(`${props.contentConfig.pageName}:create`)
const isDelete = usePermissions(`${props.contentConfig.pageName}:delete`)
const isUpdate = usePermissions(`${props.contentConfig.pageName}:update`)

const { pageList, pageTotalCount } = storeToRefs(systemStore)

function fetchPageListData(formData: any = {}) {
	const size = pageSize.value
	const offset = (currentPage.value - 1) * pageSize.value
	let info = { size, offset, ...formData }

	systemStore.postPageListDataAction(props.contentConfig.pageName, info)
}

function handleSizeChange() {
	fetchPageListData()
}

function handleCurrentChange() {
	fetchPageListData()
}

defineExpose({
	fetchPageListData
})

// 编辑/删除用户
function handleEditDeparmentInfo(row: any) {
	emit('editDepartmentInfoClick', row)
}

function deleteDepartmentClick(id: number) {
	systemStore.deletePageAction(props.contentConfig.pageName, id)
}

// 新建用户
const emit = defineEmits(['createNewDepartmentClick', 'editDepartmentInfoClick'])

function createNewDepartmentClick() {
	emit('createNewDepartmentClick')
}
</script>

<style lang="less" scoped>
.page-content {
	margin-top: 20px;
	background-color: #fff;

	.header {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		align-items: flex-end;

		.title {
			font-size: 22px;
		}

		.btn {
			margin-right: 0;
		}
	}

	.table {
		padding: 0 20px 20px 20px;
		:deep(.el-table__cell) {
			padding: 12px 0;
		}
	}
}
.pagination {
	display: flex;
	justify-content: flex-end;
	padding: 0 20px 20px 20px;
}
</style>
