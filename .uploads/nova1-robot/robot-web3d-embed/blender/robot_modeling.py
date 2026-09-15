# -*- coding: utf-8 -*-
"""
AI 辅助 Blender 建模脚本：高端人形机器人 "NOVA-1"
风格参考：Tesla Optimus / Figure 02 / Unitree G1
用法：blender -b --python robot_modeling.py
输出：robot.blend + robot.glb（含完整关节层级，供 Three.js 程序动画）
"""
import bpy
import math

OUT_DIR = "/workspace/robot-web3d"
BLEND_PATH = OUT_DIR + "/blender/robot.blend"
GLB_PATH = OUT_DIR + "/public/models/robot.glb"

# ============================================================
# 材质
# ============================================================

def mat_principled(name, base, metallic=0.0, roughness=0.5,
                   emission=None, emission_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = (*base, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission is not None:
        bsdf.inputs['Emission Color'].default_value = (*emission, 1.0)
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    return m


def build_materials():
    mats = {}
    mats['shell'] = mat_principled('mat_shell', (0.90, 0.91, 0.94), metallic=0.18, roughness=0.26)
    mats['shell_dark'] = mat_principled('mat_shell_dark', (0.16, 0.17, 0.20), metallic=0.55, roughness=0.32)
    mats['joint'] = mat_principled('mat_joint', (0.07, 0.08, 0.10), metallic=0.88, roughness=0.34)
    mats['visor'] = mat_principled('mat_visor', (0.008, 0.010, 0.016), metallic=0.65, roughness=0.06)
    mats['hand'] = mat_principled('mat_hand', (0.10, 0.11, 0.13), metallic=0.60, roughness=0.40)
    mats['accent'] = mat_principled('mat_accent', (0.70, 0.74, 0.80), metallic=0.92, roughness=0.22)
    mats['emit'] = mat_principled('mat_emit_cyan', (0.0, 0.05, 0.08),
                                  emission=(0.10, 0.75, 1.0), emission_strength=9.0)
    mats['screen'] = mat_principled('mat_screen', (0.01, 0.03, 0.05),
                                    emission=(0.02, 0.30, 0.55), emission_strength=2.2)
    return mats


# ============================================================
# 基础几何
# ============================================================

def rbox(name, size, bevel, mat, parent, loc):
    """圆角立方体"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if bevel > 0:
        mod = o.modifiers.new(name='Bevel', type='BEVEL')
        mod.width = bevel
        mod.segments = 4
        mod.limit_method = 'ANGLE'
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier='Bevel')
    o.data.materials.append(mat)
    o.parent = parent
    o.location = loc
    return o


def ball(name, radius, mat, parent, loc, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=radius, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    if scale != (1, 1, 1):
        o.scale = scale
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.shade_smooth()
    o.data.materials.append(mat)
    o.parent = parent
    o.location = loc
    return o


def cyl(name, radius, depth, mat, parent, loc, rot=(0, 0, 0), vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    o.parent = parent
    o.location = loc
    o.rotation_euler = rot
    bevel = o.modifiers.new(name='Bevel', type='BEVEL')
    bevel.width = min(radius * 0.18, 0.006)
    bevel.segments = 3
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier='Bevel')
    bpy.ops.object.shade_smooth()
    return o


def torus(name, major_r, minor_r, mat, parent, loc, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_segments=48, minor_segments=12,
                                     major_radius=major_r, minor_radius=minor_r,
                                     location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    o.parent = parent
    o.location = loc
    o.rotation_euler = rot
    bpy.ops.object.shade_smooth()
    return o


def joint(name, parent, loc):
    """关节节点（Empty），Three.js 按名称驱动"""
    bpy.ops.object.empty_add(type='PLAIN_AXES', radius=0.03, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.parent = parent
    o.location = loc
    o.empty_display_size = 0.03
    return o


# ============================================================
# 机器人构建（身高 ~1.75m，面向 Blender -Y，导出后朝 +Z）
# 髋关节高度 0.94，机器人站立在 z=0
# ============================================================

def build_robot(M):
    # 根节点：位于髋部高度，行走/起伏时整体移动
    bpy.ops.object.empty_add(type='PLAIN_AXES', radius=0.05, location=(0, 0, 0.94))
    root = bpy.context.active_object
    root.name = "robot_root"

    # ---- 骨盆 ----
    rbox('pelvis', (0.30, 0.19, 0.17), 0.065, M['shell'], root, (0, 0, 0.055))
    rbox('pelvis_belt', (0.315, 0.20, 0.045), 0.02, M['shell_dark'], root, (0, 0, 0.115))

    # ---- 脊柱关节（弯腰） ----
    spine = joint('joint_spine', root, (0, 0, 0.13))  # 世界 z=1.07

    # 躯干（胸廓）
    rbox('torso', (0.34, 0.215, 0.42), 0.075, M['shell'], spine, (0, 0, 0.21))
    # 后背板
    rbox('backpack', (0.22, 0.055, 0.30), 0.025, M['shell_dark'], spine, (0, 0.115, 0.20))
    # 胸口屏幕边框 + 屏幕
    rbox('chest_bezel', (0.145, 0.022, 0.105), 0.012, M['shell_dark'], spine, (0, -0.105, 0.26))
    rbox('chest_screen', (0.128, 0.010, 0.089), 0.008, M['screen'], spine, (0, -0.117, 0.26))
    # 腰部装饰环
    torus('waist_ring', 0.148, 0.012, M['accent'], spine, (0, 0, 0.02))

    # ---- 颈部关节（注视跟随） ----
    neck = joint('joint_neck', spine, (0, 0, 0.435))  # 世界 z≈1.505
    cyl('neck_col', 0.048, 0.07, M['joint'], neck, (0, 0, 0.02))
    torus('neck_ring', 0.055, 0.008, M['emit'], neck, (0, 0, 0.045))

    # 头部（圆润科技感）
    rbox('head', (0.20, 0.19, 0.22), 0.075, M['shell'], neck, (0, 0, 0.135))
    # 面罩（黑色曲面视觉区）
    rbox('visor', (0.175, 0.075, 0.150), 0.048, M['visor'], neck, (0, -0.060, 0.135))
    # 双眼（发光，Three.js 可做表情动画）
    rbox('eye_l', (0.034, 0.014, 0.052), 0.012, M['emit'], neck, (-0.052, -0.097, 0.145))
    rbox('eye_r', (0.034, 0.014, 0.052), 0.012, M['emit'], neck, (0.052, -0.097, 0.145))
    # 耳侧传感模块
    cyl('ear_l', 0.032, 0.022, M['shell_dark'], neck, (-0.105, 0, 0.135), rot=(0, math.radians(90), 0))
    cyl('ear_r', 0.032, 0.022, M['shell_dark'], neck, (0.105, 0, 0.135), rot=(0, math.radians(90), 0))
    # 顶部激光雷达模块
    cyl('lidar_base', 0.035, 0.018, M['shell_dark'], neck, (0, 0.01, 0.245))
    cyl('lidar_head', 0.028, 0.022, M['visor'], neck, (0, 0.01, 0.262))

    # ---- 手臂（左/右） ----
    for side, sx in (('l', 1), ('r', -1)):
        sh = joint(f'joint_shoulder_{side}', spine, (sx * 0.215, 0, 0.40))
        ball(f'shoulder_ball_{side}', 0.058, M['joint'], sh, (0, 0, 0))
        # 上臂外壳（白色包覆）
        rbox(f'upper_arm_{side}', (0.095, 0.095, 0.28), 0.042, M['shell'], sh, (0, 0, -0.165))
        # 肩部白色端盖
        ball(f'shoulder_cap_{side}', 0.062, M['shell'], sh, (sx * 0.012, 0, 0.0), scale=(1.15, 1, 1))

        el = joint(f'joint_elbow_{side}', sh, (0, 0, -0.315))
        cyl(f'elbow_disc_{side}', 0.048, 0.075, M['joint'], el, (0, 0, 0), rot=(0, math.radians(90), 0))
        rbox(f'forearm_{side}', (0.082, 0.082, 0.25), 0.036, M['shell'], el, (0, 0, -0.145))
        # 小臂深色环
        torus(f'forearm_ring_{side}', 0.048, 0.007, M['accent'], el, (0, 0, -0.265))

        wr = joint(f'joint_wrist_{side}', el, (0, 0, -0.29))
        ball(f'wrist_ball_{side}', 0.034, M['joint'], wr, (0, 0, 0))
        rbox(f'hand_{side}', (0.075, 0.048, 0.145), 0.022, M['hand'], wr, (0, -0.008, -0.095))

    # ---- 腿（左/右） ----
    for side, sx in (('l', 1), ('r', -1)):
        hip = joint(f'joint_hip_{side}', root, (sx * 0.105, 0, 0))
        ball(f'hip_ball_{side}', 0.062, M['joint'], hip, (0, 0, 0))
        rbox(f'thigh_{side}', (0.135, 0.125, 0.38), 0.055, M['shell'], hip, (0, 0, -0.21))

        knee = joint(f'joint_knee_{side}', hip, (0, 0, -0.425))
        cyl(f'knee_disc_{side}', 0.058, 0.10, M['joint'], knee, (0, 0, 0), rot=(0, math.radians(90), 0))
        rbox(f'calf_{side}', (0.115, 0.115, 0.40), 0.05, M['shell'], knee, (0, 0.005, -0.22))
        # 小腿后部深色线条
        rbox(f'calf_line_{side}', (0.03, 0.02, 0.30), 0.008, M['shell_dark'], knee, (0, 0.066, -0.22))

        ank = joint(f'joint_ankle_{side}', knee, (0, 0, -0.445))
        ball(f'ankle_ball_{side}', 0.045, M['joint'], ank, (0, 0, 0))
        rbox(f'foot_{side}', (0.115, 0.245, 0.085), 0.032, M['shell'], ank, (0, -0.048, -0.048))
        rbox(f'sole_{side}', (0.118, 0.25, 0.022), 0.008, M['shell_dark'], ank, (0, -0.048, -0.085))

    return root


# ============================================================
# 主流程
# ============================================================

def main():
    # 清空场景
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.meshes):
        if m.users == 0:
            bpy.data.meshes.remove(m)
    for m in list(bpy.data.materials):
        if m.users == 0:
            bpy.data.materials.remove(m)

    M = build_materials()
    build_robot(M)

    # 保存 .blend
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print("saved:", BLEND_PATH)

    # 导出 glb（+Y up，应用修改器，含材质）
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format='GLB',
        export_yup=True,
        export_apply=True,
        export_materials='EXPORT',
        export_extras=True,
    )
    print("exported:", GLB_PATH)

    # 输出节点清单，供 Three.js 校验
    names = sorted(o.name for o in bpy.context.scene.objects)
    print("OBJECTS:", ",".join(names))


if __name__ == "__main__":
    main()
