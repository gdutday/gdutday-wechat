import commonFun from '@/commonFun.js';
export default {
	state:{
		stack:[],
		recentStack:commonFun.getStorageSync('recentStack',[],true),
		templeItem:{},
	},
	mutations: {
		changeStateofFile: commonFun.ChangeAndStorageState,
		popStack(state){
			state.stack.pop();
		},
		pushStack(state){
			state.stack.push(state.templeItem);
		},
		clearStack(state){
			state.stack = [];
		},
		unshiftRecentStack(state,playLoad){
			const MAX_LENGTH = 6;
			let newStack = state.recentStack.filter(item=>item.url != playLoad.url);
			newStack.unshift(playLoad);
			if(newStack.length > MAX_LENGTH) newStack.pop();
			state.recentStack = newStack;
			uni.setStorageSync('recentStack',JSON.stringify(newStack));
			// url: '',
			// type: '',
			// name: '',
			// unShare:true,
		},
	},
	getters: {

	}
}