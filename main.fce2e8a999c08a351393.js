(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{3:function(n,e,t){"use strict";t.r(e);var i=t(0),a=t(1);function o(n,e){var t=i.ab.merge([i.O.lambert.uniforms,{lightPosition:{value:e},isShadow:{value:n},bias:{value:-.1}}]);return new i.P({uniforms:t,vertexShader:"\n                #include <common>\n                ".concat("\nuniform vec3 lightPosition;\nuniform bool isShadow;\nuniform float bias;\n\nvarying vec3 vViewPosition;\n\nvarying vec3 vLightFront;\nvarying vec3 vIndirectFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\nvarying vec3 vIndirectBack;\n#endif\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n    #include <uv_vertex>\n    #include <uv2_vertex>\n    #include <color_vertex>\n    #include <beginnormal_vertex>\n    #include <morphnormal_vertex>\n    #include <skinbase_vertex>\n    #include <skinnormal_vertex>\n    #include <defaultnormal_vertex>\n    #include <begin_vertex>\n    #include <morphtarget_vertex>\n    #include <skinning_vertex>\n\n    // #include <project_vertex>\n    vec3 pp = transformed;\n    vec3 nn = objectNormal;\n    vec3 translated = pp;\n    vec3 nlight = normalize(lightPosition);\n    float d = dot(normalize(nn), nlight);\n\n    if (isShadow)\n    {\n        vec3 infty;\n        if (d < bias) {\n            infty = pp - nlight * 10000000.0;\n        } else {\n            //infty = position - nlight * 0.1; // normal * 0.5; // To expose\n            infty = pp - normalize(nn) * 0.1; // To expose\n        }\n        translated = infty;\n    }\n    vec4 mvPosition =  modelViewMatrix * vec4(translated, 1.0);\n    gl_Position = projectionMatrix * mvPosition;\n\n    #include <logdepthbuf_vertex>\n    #include <clipping_planes_vertex>\n    #include <worldpos_vertex>\n    #include <envmap_vertex>\n    #include <lights_lambert_vertex>\n    #include <shadowmap_vertex>\n    #include <fog_vertex>\n}\n","\n            "),fragmentShader:i.O.lambert.fragmentShader,lights:!0})}var r=t(2),s=t.p+"9a80489e046f0d3e164a6f0955a8df98.fbx";function l(n){n.scale.multiplyScalar(.1),n.position.set(5,-25,-10)}function c(n,e,t,a,c){(new r.a).load(s,(function(r){var s=new i.c(r);s.clipAction(r.animations[0]).play(),l(r);var d=new i.q;d.add(r),r.traverse((function(n){if(n.isMesh){var i=new n.constructor(n.geometry,o(!0,a));!function(n){for(var e,t=n.geometry,i=t.attributes.position,a=t.attributes.normal.array,o=i.count,r=[],s=[-1/0,-1/0,-1/0],l=[1/0,1/0,1/0],c=i.array,d=0;d<o;++d){var p=c[e=3*d],u=c[e+1],v=c[e+2];s[0]=s[0]<p?p:s[0],s[1]=s[1]<u?u:s[1],s[2]=s[2]<v?v:s[2],l[0]=l[0]>p?p:l[0],l[1]=l[1]>u?u:l[1],l[2]=l[2]>v?v:l[2],r.push([p,u,v,d])}r.sort((function(n,e){return n[0]-e[0]}));var w=s[0]-l[0],h=s[1]-l[1],f=s[2]-l[2],m=Math.sqrt(Math.pow(w,2)+Math.pow(h,2)+Math.pow(f,2))/1e3,g=m,_=new Uint8Array(o);_.fill(0);for(var x=0,y=0,E=0;E<o;++E)if(!_[E]){for(var b=r[E],M=b[0],P=b[1],S=b[2],z=0,k=[],I=E+1;z<g&&I!==o;){var C=r[I];if(_[I])++I;else{var B=C[0],F=C[1],L=C[2];if((z=B-M)>g)break;Math.sqrt(Math.pow(M-B,2)+Math.pow(P-F,2)+Math.pow(S-L,2))<m&&(k.push(C[3]),_[I]=1),++I}}if(k.length){++x;var T=b[3],K=[a[3*T],a[3*T+1],a[3*T+2]],A=k.length+1;k.length>5&&++y;for(var N=0;N<k.length;++N){var O=k[N];K[0]+=a[3*O],K[1]+=a[3*O+1],K[2]+=a[3*O+2]}K[0]/=A,K[1]/=A,K[2]/=A,a[3*T]=K[0],a[3*T+1]=K[1],a[3*T+2]=K[2];for(var D=0;D<k.length;++D){var G=k[D];a[3*G]=K[0],a[3*G+1]=K[1],a[3*G+2]=K[2]}}}x>0&&console.log("Snapped ".concat(x," locations.")),y>0&&console.log("".concat(y," snaps done on more than 5 points.")),n.geometry.attributes.normal.needsUpdate=!0}(i),t.push(i),e.add(i),i.material.skinning=n.isSkinnedMesh,i.skeleton=n.skeleton,l(i)}})),n.add(d),c.push(s)}))}var d,p,u,v,w,h,f,m,g,_,x=window.innerWidth,y=window.innerHeight,E=x/y,b=[],M=[],P=[];function S(n){var e=new i.Y(10,3,200,25),t=new i.z(e,o(n,h));t.scale.multiplyScalar(.6),t.position.set(-5,-10,5);var a=new i.z(new i.Y(10,3,200,25),o(n,h));a.scale.multiplyScalar(.5),a.rotation.set(0,Math.PI/2,0),a.position.set(15,5,0);var r=new i.z(new i.Y(10,3,200,25),o(n,h));r.scale.multiplyScalar(.5),r.rotation.set(0,Math.PI/2,Math.PI/2),r.position.set(-15,5,10);var s=new i.z(new i.S(5,32,32),o(n,h));s.position.set(5,-15,15);var l=new i.z(new i.S(5,32,32),o(n,h));return l.scale.multiplyScalar(1.5),l.position.set(-10,-5,-15),[t,a,r,s,l]}(function(){var n,e;(v=new i.gb({antialias:!0})).setPixelRatio(window.devicePixelRatio),v.setSize(x,y),document.body.appendChild(v.domElement),p=new i.N,u=new i.N,d=new i.F(90,E,.1,5e3),p.add(d),d.position.set(0,0,30),h=new i.cb(1,1,1),(f=new i.H(16777215,.5)).position.copy(h),M.push(f),p.add(f),m=new i.I(f,5),p.add(m),_=new i.a(4210752),p.add(_),e=0,(n=[]).push(new i.z(new i.G(50,50),new i.B({color:16711680,side:i.p}))),n[e].position.set(0,-25,0),n[e].rotation.x=-Math.PI/2,p.add(n[e++]),n.push(new i.z(new i.G(50,50),new i.B({color:255,side:i.p}))),n[e].position.set(0,0,-25),p.add(n[e++]),n.push(new i.z(new i.G(50,50),new i.B({color:65280,side:i.p}))),n[e].position.set(-25,0,0),n[e].rotation.y=Math.PI/2,p.add(n[e++]),n.push(new i.z(new i.G(50,50),new i.B({color:65280,side:i.p}))),n[e].position.set(25,0,0),n[e].rotation.y=-Math.PI/2,p.add(n[e++]),n.push(new i.z(new i.G(50,50),new i.B({color:255,side:i.p}))),n[e].position.set(0,0,25),n[e].rotation.y=Math.PI,p.add(n[e++]);var t=function(){d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),v.setSize(window.innerWidth,window.innerHeight)};window.addEventListener("resize",t,!1),window.addEventListener("orientationchange",t,!1),w=new a.a(d,v.domElement),v.autoClear=!1,v.autoClearStencil=!1,v.autoClearDepth=!1,v.autoClearColor=!1,g=v.getContext()})(),S(!1).forEach((function(n){return p.add(n)})),(b=S(!0)).forEach((function(n){u.add(n)})),c(p,u,b,h,P),function n(){requestAnimationFrame(n);var e=window.performance.now(),t=e-k;k=e,z+=.001*t,h.x=10*Math.sin(z),h.z=10*Math.cos(z)+4,h.y=Math.cos(z)*Math.sin(z)*10,b.forEach((function(n){var e=n.matrixWorld,t=new i.y;t.getInverse(e);var a=new i.db;a.set(h.x,h.y,h.z,1),a.applyMatrix4(t),n.material.uniforms.lightPosition.value=a})),f.position.copy(h),P.length&&P.forEach((function(n){return n.update(t/1e3)}));w.update(),function(n,e,t,i,a,o){e.clear(),o.forEach((function(n){n.intensity=0})),e.render(t,a),function(n,e,t,i){n.enable(n.STENCIL_TEST),n.stencilFunc(n.ALWAYS,1,255),n.depthMask(!1),n.colorMask(!1,!1,!1,!1),n.cullFace(n.FRONT),n.stencilOp(n.KEEP,n.INCR,n.KEEP),e.render(t,i),n.cullFace(n.BACK),n.stencilOp(n.KEEP,n.DECR,n.KEEP),e.render(t,i),n.stencilFunc(n.EQUAL,0,255),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.depthMask(!0),n.colorMask(!0,!0,!0,!0)}(n,e,i,a),o.forEach((function(n){n.intensity=1})),e.render(t,a),n.disable(n.STENCIL_TEST)}(g,v,p,u,d,M)}();var z=0,k=window.performance.now()}},[[3,1,2]]]);