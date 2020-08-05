import {Vue} from 'vue-property-decorator';

export default class SelectLocation extends Vue {
    private name: string = 'SelectLocation';
    private created() {
        console.log('组件初始化');
    }
}
