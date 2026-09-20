import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Link2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/effects/FadeIn';

// 素材类型：image（图片素材）/ link（设计网站）
// 图片分类固定四类：产品、摄影、版式、绘画
type ImageCategory = '产品' | '摄影' | '版式' | '绘画';

type LibraryItem =
  | {
      id: string;
      type: 'image';
      src: string;
      category: ImageCategory;
      createdAt: string; // ISO 日期字符串，用于排序
    }
  | {
      id: string;
      type: 'link';
      title: string;
      url: string;
      description: string;
      tags: string[];
    };

const IMAGE_CATEGORIES: ImageCategory[] = ['产品', '摄影', '版式', '绘画'];

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

const libraryItems: LibraryItem[] = [
  // 示例图片素材（按上传时间倒序排列，越新越靠前）
  {
    id: 'img-1',
    type: 'image',
    src: 'images/library-1.jpg',
    category: '摄影',
    createdAt: '2026-09-06T10:00:00.000Z',
  },
  {
    id: 'img-2',
    type: 'image',
    src: 'images/library-2.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:50:00.000Z',
  },
  {
    id: 'img-3',
    type: 'image',
    src: 'images/library-3.jpg',
    category: '绘画',
    createdAt: '2026-09-06T09:40:00.000Z',
  },
  {
    id: 'img-4',
    type: 'image',
    src: 'images/library-4.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:30:00.000Z',
  },
  {
    id: 'img-5',
    type: 'image',
    src: 'images/library-5.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:20:00.000Z',
  },
  {
    id: 'img-6',
    type: 'image',
    src: 'images/library-6.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:10:00.000Z',
  },
  {
    id: 'img-7',
    type: 'image',
    src: 'images/library-7.jpg',
    category: '版式',
    createdAt: '2026-09-06T09:00:00.000Z',
  },
  {
    id: 'img-8',
    type: 'image',
    src: 'images/library-8.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:50:00.000Z',
  },
  {
    id: 'img-9',
    type: 'image',
    src: 'images/library-9.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:40:00.000Z',
  },
  {
    id: 'img-10',
    type: 'image',
    src: 'images/library-10.jpg',
    category: '产品',
    createdAt: '2026-09-06T08:30:00.000Z',
  },
  {
    id: 'img-11',
    type: 'image',
    src: 'images/library-11.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:20:00.000Z',
  },
  {
    id: 'img-12',
    type: 'image',
    src: 'images/library-12.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:10:00.000Z',
  },
  // 新增产品类素材
  {
    id: 'img-13',
    type: 'image',
    src: 'images/library-13.jpg',
    category: '产品',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'img-14',
    type: 'image',
    src: 'images/library-14.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:50:00.000Z',
  },
  {
    id: 'img-15',
    type: 'image',
    src: 'images/library-15.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:40:00.000Z',
  },
  {
    id: 'img-16',
    type: 'image',
    src: 'images/library-16.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:30:00.000Z',
  },
  {
    id: 'img-17',
    type: 'image',
    src: 'images/library-17.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:20:00.000Z',
  },
  {
    id: 'img-18',
    type: 'image',
    src: 'images/library-18.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:10:00.000Z',
  },
  {
    id: 'img-19',
    type: 'image',
    src: 'images/library-19.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:00:00.000Z',
  },
  {
    id: 'img-20',
    type: 'image',
    src: 'images/library-20.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:50:00.000Z',
  },
  // 新增摄影类素材
  {
    id: 'img-21',
    type: 'image',
    src: 'images/library-21.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:40:00.000Z',
  },
  {
    id: 'img-22',
    type: 'image',
    src: 'images/library-22.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:30:00.000Z',
  },
  {
    id: 'img-23',
    type: 'image',
    src: 'images/library-23.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:20:00.000Z',
  },
  {
    id: 'img-24',
    type: 'image',
    src: 'images/library-24.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:10:00.000Z',
  },
  // 新增版式类素材
  {
    id: 'img-25',
    type: 'image',
    src: 'images/library-25.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'img-26',
    type: 'image',
    src: 'images/library-26.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:50:00.000Z',
  },
  {
    id: 'img-27',
    type: 'image',
    src: 'images/library-27.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:40:00.000Z',
  },
  {
    id: 'img-28',
    type: 'image',
    src: 'images/library-28.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:30:00.000Z',
  },
  // 新增绘画类素材
  {
    id: 'img-29',
    type: 'image',
    src: 'images/library-29.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:20:00.000Z',
  },
  {
    id: 'img-30',
    type: 'image',
    src: 'images/library-30.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:10:00.000Z',
  },
  {
    id: 'img-31',
    type: 'image',
    src: 'images/library-31.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:00:00.000Z',
  },
  {
    id: 'img-32',
    type: 'image',
    src: 'images/library-32.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:50:00.000Z',
  },
  {
    id: 'img-33',
    type: 'image',
    src: 'images/library-33.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:40:00.000Z',
  },
  {
    id: 'img-34',
    type: 'image',
    src: 'images/library-34.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:30:00.000Z',
  },
{
    id: 'img-35',
    type: 'image',
    src: 'images/library-35.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:00:00.000Z',
  },
  {
    id: 'img-36',
    type: 'image',
    src: 'images/library-36.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:59:00.000Z',
  },
  {
    id: 'img-37',
    type: 'image',
    src: 'images/library-37.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:58:00.000Z',
  },
  {
    id: 'img-38',
    type: 'image',
    src: 'images/library-38.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:57:00.000Z',
  },
  {
    id: 'img-39',
    type: 'image',
    src: 'images/library-39.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:56:00.000Z',
  },
  {
    id: 'img-40',
    type: 'image',
    src: 'images/library-40.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:55:00.000Z',
  },
  {
    id: 'img-41',
    type: 'image',
    src: 'images/library-41.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:54:00.000Z',
  },
  {
    id: 'img-42',
    type: 'image',
    src: 'images/library-42.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:53:00.000Z',
  },
  {
    id: 'img-43',
    type: 'image',
    src: 'images/library-43.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:52:00.000Z',
  },
  {
    id: 'img-44',
    type: 'image',
    src: 'images/library-44.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:51:00.000Z',
  },
  {
    id: 'img-45',
    type: 'image',
    src: 'images/library-45.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:50:00.000Z',
  },
  {
    id: 'img-46',
    type: 'image',
    src: 'images/library-46.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:49:00.000Z',
  },
  {
    id: 'img-47',
    type: 'image',
    src: 'images/library-47.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:48:00.000Z',
  },
  {
    id: 'img-48',
    type: 'image',
    src: 'images/library-48.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:47:00.000Z',
  },
  {
    id: 'img-49',
    type: 'image',
    src: 'images/library-49.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:46:00.000Z',
  },
  {
    id: 'img-50',
    type: 'image',
    src: 'images/library-50.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:45:00.000Z',
  },
  {
    id: 'img-51',
    type: 'image',
    src: 'images/library-51.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:44:00.000Z',
  },
  {
    id: 'img-52',
    type: 'image',
    src: 'images/library-52.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:43:00.000Z',
  },
  {
    id: 'img-53',
    type: 'image',
    src: 'images/library-53.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:42:00.000Z',
  },
  {
    id: 'img-54',
    type: 'image',
    src: 'images/library-54.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:41:00.000Z',
  },
  {
    id: 'img-55',
    type: 'image',
    src: 'images/library-55.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:40:00.000Z',
  },
  {
    id: 'img-56',
    type: 'image',
    src: 'images/library-56.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:39:00.000Z',
  },
  {
    id: 'img-57',
    type: 'image',
    src: 'images/library-57.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:38:00.000Z',
  },
  {
    id: 'img-58',
    type: 'image',
    src: 'images/library-58.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:37:00.000Z',
  },
  {
    id: 'img-59',
    type: 'image',
    src: 'images/library-59.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:36:00.000Z',
  },
  {
    id: 'img-60',
    type: 'image',
    src: 'images/library-60.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:35:00.000Z',
  },
  {
    id: 'img-61',
    type: 'image',
    src: 'images/library-61.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:34:00.000Z',
  },
  {
    id: 'img-62',
    type: 'image',
    src: 'images/library-62.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:33:00.000Z',
  },
  {
    id: 'img-63',
    type: 'image',
    src: 'images/library-63.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:32:00.000Z',
  },
  {
    id: 'img-64',
    type: 'image',
    src: 'images/library-64.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:31:00.000Z',
  },
  {
    id: 'img-65',
    type: 'image',
    src: 'images/library-65.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:30:00.000Z',
  },
  {
    id: 'img-66',
    type: 'image',
    src: 'images/library-66.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:29:00.000Z',
  },
  {
    id: 'img-67',
    type: 'image',
    src: 'images/library-67.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:28:00.000Z',
  },
  {
    id: 'img-68',
    type: 'image',
    src: 'images/library-68.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:27:00.000Z',
  },
  {
    id: 'img-69',
    type: 'image',
    src: 'images/library-69.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:26:00.000Z',
  },
  {
    id: 'img-70',
    type: 'image',
    src: 'images/library-70.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:25:00.000Z',
  },
  {
    id: 'img-71',
    type: 'image',
    src: 'images/library-71.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:24:00.000Z',
  },
  {
    id: 'img-72',
    type: 'image',
    src: 'images/library-72.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:23:00.000Z',
  },
  {
    id: 'img-73',
    type: 'image',
    src: 'images/library-73.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:22:00.000Z',
  },
  {
    id: 'img-74',
    type: 'image',
    src: 'images/library-74.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:21:00.000Z',
  },
  {
    id: 'img-75',
    type: 'image',
    src: 'images/library-75.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:20:00.000Z',
  },
  {
    id: 'img-76',
    type: 'image',
    src: 'images/library-76.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:19:00.000Z',
  },
  {
    id: 'img-77',
    type: 'image',
    src: 'images/library-77.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:18:00.000Z',
  },
  {
    id: 'img-78',
    type: 'image',
    src: 'images/library-78.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:17:00.000Z',
  },
  {
    id: 'img-79',
    type: 'image',
    src: 'images/library-79.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:16:00.000Z',
  },
  {
    id: 'img-80',
    type: 'image',
    src: 'images/library-80.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:15:00.000Z',
  },
  {
    id: 'img-81',
    type: 'image',
    src: 'images/library-81.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:14:00.000Z',
  },
  {
    id: 'img-82',
    type: 'image',
    src: 'images/library-82.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:13:00.000Z',
  },
  {
    id: 'img-83',
    type: 'image',
    src: 'images/library-83.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:12:00.000Z',
  },
  {
    id: 'img-84',
    type: 'image',
    src: 'images/library-84.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:11:00.000Z',
  },
  {
    id: 'img-85',
    type: 'image',
    src: 'images/library-85.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:10:00.000Z',
  },
  {
    id: 'img-86',
    type: 'image',
    src: 'images/library-86.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:09:00.000Z',
  },
  {
    id: 'img-87',
    type: 'image',
    src: 'images/library-87.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:08:00.000Z',
  },
  {
    id: 'img-88',
    type: 'image',
    src: 'images/library-88.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:07:00.000Z',
  },
  {
    id: 'img-89',
    type: 'image',
    src: 'images/library-89.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:06:00.000Z',
  },
  {
    id: 'img-90',
    type: 'image',
    src: 'images/library-90.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:05:00.000Z',
  },
  {
    id: 'img-91',
    type: 'image',
    src: 'images/library-91.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:04:00.000Z',
  },
  {
    id: 'img-92',
    type: 'image',
    src: 'images/library-92.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:03:00.000Z',
  },
  {
    id: 'img-93',
    type: 'image',
    src: 'images/library-93.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:02:00.000Z',
  },
  {
    id: 'img-94',
    type: 'image',
    src: 'images/library-94.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:01:00.000Z',
  },
  {
    id: 'img-95',
    type: 'image',
    src: 'images/library-95.jpg',
    category: '绘画',
    createdAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'img-96',
    type: 'image',
    src: 'images/library-96.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:59:00.000Z',
  },
  {
    id: 'img-97',
    type: 'image',
    src: 'images/library-97.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:58:00.000Z',
  },
  {
    id: 'img-98',
    type: 'image',
    src: 'images/library-98.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:57:00.000Z',
  },
  {
    id: 'img-99',
    type: 'image',
    src: 'images/library-99.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:56:00.000Z',
  },
  {
    id: 'img-100',
    type: 'image',
    src: 'images/library-100.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:55:00.000Z',
  },
  {
    id: 'img-101',
    type: 'image',
    src: 'images/library-101.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:54:00.000Z',
  },
  {
    id: 'img-102',
    type: 'image',
    src: 'images/library-102.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:53:00.000Z',
  },
  {
    id: 'img-103',
    type: 'image',
    src: 'images/library-103.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:52:00.000Z',
  },
  {
    id: 'img-104',
    type: 'image',
    src: 'images/library-104.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:51:00.000Z',
  },
  // 示例设计网站
  {
    id: 'link-1',
    type: 'link',
    title: 'Awwwards',
    url: 'https://www.awwwards.com',
    description: '全球最佳网站设计灵感与趋势',
    tags: ['灵感', '网站'],
  },
  {
    id: 'link-2',
    type: 'link',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '设计师作品社区与配色参考',
    tags: ['配色', '插画'],
  },
  {
    id: 'link-3',
    type: 'link',
    title: 'Mobbin',
    url: 'https://mobbin.com',
    description: '真实 App 界面设计模式库',
    tags: ['移动端', 'UI'],
  },
  {
    id: 'link-4',
    type: 'link',
    title: 'Godly',
    url: 'https://godly.website',
    description: '精选落地页与交互设计灵感',
    tags: ['落地页', '动效'],
  },
  {
    id: 'link-5',
    type: 'link',
    title: 'Behance',
    url: 'https://www.behance.net',
    description: 'Adobe 旗下全球最大的创意作品与设计师交流平台',
    tags: ['作品集', '灵感'],
  },
  {
    id: 'link-6',
    type: 'link',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '设计师作品社区，适合找配色、插画与 UI 细节',
    tags: ['配色', '插画'],
  },
  {
    id: 'link-7',
    type: 'link',
    title: 'Pinterest',
    url: 'https://www.pinterest.com',
    description: '图像分享与情绪板工具，适合主题搜集与风格探索',
    tags: ['情绪板', '灵感'],
  },
  {
    id: 'link-8',
    type: 'link',
    title: 'Muzli',
    url: 'https://muz.li',
    description: '聚合 150+ 设计网站最新作品，每日设计早餐',
    tags: ['趋势', '聚合'],
  },
  {
    id: 'link-9',
    type: 'link',
    title: 'Collect UI',
    url: 'https://collectui.com',
    description: '按页面类型分类的 UI 灵感库，登录、支付、设置等',
    tags: ['移动端', 'UI'],
  },
  {
    id: 'link-10',
    type: 'link',
    title: 'Land-book',
    url: 'https://land-book.com',
    description: '专注落地页与营销站点设计参考',
    tags: ['落地页', '营销'],
  },
  {
    id: 'link-11',
    type: 'link',
    title: 'SiteInspire',
    url: 'https://www.siteinspire.com',
    description: '按风格与类型筛选的网站设计灵感库',
    tags: ['网页', '排版'],
  },
  {
    id: 'link-12',
    type: 'link',
    title: 'Lapa Ninja',
    url: 'https://www.lapa.ninja',
    description: '精选落地页设计案例与首屏结构参考',
    tags: ['落地页', '首屏'],
  },
  {
    id: 'link-13',
    type: 'link',
    title: 'One Page Love',
    url: 'https://onepagelove.com',
    description: '单页网站与模板集合，研究信息密度控制',
    tags: ['单页', '模板'],
  },
  {
    id: 'link-14',
    type: 'link',
    title: 'Designspiration',
    url: 'https://www.designspiration.com',
    description: '图像与颜色搜索引擎，适合建立情绪版',
    tags: ['颜色', '灵感'],
  },
  {
    id: 'link-15',
    type: 'link',
    title: 'Niice',
    url: 'https://niice.co',
    description: '聚合 Behance、Dribbble 等平台的高质量灵感库',
    tags: ['灵感', '搜索'],
  },
  {
    id: 'link-16',
    type: 'link',
    title: 'UI Design Daily',
    url: 'https://www.uidesigndaily.com',
    description: '每日更新的 UI 设计灵感与组件参考',
    tags: ['UI', '组件'],
  },
  {
    id: 'link-17',
    type: 'link',
    title: 'Bestfolio',
    url: 'https://www.bestfolios.com',
    description: '设计师作品集与简历模板参考',
    tags: ['作品集', '简历'],
  },
  {
    id: 'link-18',
    type: 'link',
    title: 'motionsites',
    url: 'https://motionsites.ai',
    description: '精选网站动效与交互设计作品集',
    tags: ['动效', '交互'],
  },
  {
    id: 'link-19',
    type: 'link',
    title: 'Dark Design',
    url: 'https://www.dark.design',
    description: '深色主题设计灵感，适合科技、AI、硬件视觉',
    tags: ['深色模式', '科技'],
  },
  {
    id: 'link-20',
    type: 'link',
    title: '花瓣网',
    url: 'https://huaban.com',
    description: '中国最大的设计师灵感采集与素材分享平台',
    tags: ['灵感', '国内'],
  },
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ImageCategory | null>(null);
  const [activeType, setActiveType] = useState<'image' | 'link'>('image');

  const allLinkTags = Array.from(
    new Set(libraryItems.filter((i): i is Extract<LibraryItem, { type: 'link' }> => i.type === 'link').flatMap((i) => i.tags))
  );

  const filteredItems = libraryItems
    .filter((item) => {
      const matchesType = item.type === activeType;
      if (item.type === 'image') {
        const matchesCategory = !activeCategory || item.category === activeCategory;
        const matchesSearch = !searchQuery || item.category.includes(searchQuery);
        return matchesType && matchesCategory && matchesSearch;
      }
      const matchesTag = !activeCategory || item.tags.includes(activeCategory);
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (a.type === 'image' && b.type === 'image') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const imageCount = libraryItems.filter((i) => i.type === 'image').length;
  const linkCount = libraryItems.filter((i) => i.type === 'link').length;

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-lavender/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-sage/5 blur-3xl" />

        <div className="max-w-container mx-auto relative z-10">
          <SectionTitle en="LIBRARY" zh="素材库">
            <p className="text-text-secondary">
              收集设计灵感、视觉参考和优秀网站。持续更新，随手取用。
            </p>
          </SectionTitle>

          {/* Stats */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{libraryItems.length}</div>
                <div className="text-xs text-text-muted mt-1">总素材</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{imageCount}</div>
                <div className="text-xs text-text-muted mt-1">图片素材</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{linkCount}</div>
                <div className="text-xs text-text-muted mt-1">设计网站</div>
              </div>
            </div>
          </FadeIn>

          {/* Search & Filter */}
          <FadeIn delay={0.15}>
            <div className="mb-12 space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="搜索素材..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border text-sm focus:outline-none focus:border-accent-terracotta transition-colors"
                />
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="图片"
                  active={activeType === 'image'}
                  onClick={() => setActiveType('image')}
                />
                <Tag
                  label="网站"
                  active={activeType === 'link'}
                  onClick={() => setActiveType('link')}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="全部"
                  active={!activeCategory}
                  onClick={() => setActiveCategory(null)}
                />
                {(activeType === 'image' ? IMAGE_CATEGORIES : allLinkTags).map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    active={activeCategory === tag}
                    onClick={() => setActiveCategory(tag as ImageCategory)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Items Masonry */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.08}>
                {item.type === 'image' ? (
                  <article className="card p-0 group overflow-hidden break-inside-avoid">
                    <div className="overflow-hidden relative">
                      <img
                        src={item.src}
                        alt={item.category}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        {item.category}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(new Date(item.createdAt))}
                      </span>
                    </div>
                  </article>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-5 group break-inside-avoid block hover:border-accent-terracotta transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-accent-clay/10 flex items-center justify-center">
                        <Link2 size={14} className="text-accent-clay" />
                      </div>
                      <span className="text-xs font-medium text-accent-clay">网站</span>
                    </div>
                    <h3 className="font-display-zh text-lg mb-2 group-hover:text-accent-terracotta transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-xs text-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </a>
                )}
              </FadeIn>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <FadeIn>
              <div className="text-center py-24 text-text-muted">
                <p>没有找到相关素材</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Library;