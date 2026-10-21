// A user-controlled orbit: three visible projects, one shared spotlight.
// Native buttons, inert back faces and a stable reading panel keep the 3D stage usable.
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
export function createProjectOrbit({groups,createMedia,onOpen,onRotate}) {
 const root=el('div','project-orbit');
 const tabs=el('div','showcase-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Selected project collections');
 const intro=el('p','orbit-introduction');
 const panel=el('div','orbit-panel');panel.id='orbit-panel';panel.setAttribute('role','tabpanel');panel.tabIndex=0;
 const stage=el('div','orbit-stage');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Project spotlight');
 const scenery=el('div','orbit-scenery');scenery.setAttribute('aria-hidden','true');
 scenery.innerHTML=`<svg class="orbit-sphere" viewBox="0 0 1000 450" fill="none"><g stroke="currentColor" stroke-width=".8"><ellipse class="draw-path" pathLength="1" cx="500" cy="214" rx="355" ry="175"/><ellipse class="draw-path" pathLength="1" cx="500" cy="214" rx="230" ry="175"/><ellipse class="draw-path" pathLength="1" cx="500" cy="214" rx="85" ry="175"/><ellipse class="draw-path" pathLength="1" cx="500" cy="214" rx="355" ry="69"/><path class="draw-path" pathLength="1" d="M145 214h710M500 39v350"/></g></svg><div class="orbit-light"></div><svg class="orbit-podium" viewBox="0 0 1000 150" fill="none"><g stroke="currentColor" stroke-width=".9"><path class="draw-path" pathLength="1" d="m273 67 227-42 227 42-227 43zM273 67v14l227 42 227-42V67M500 110v13"/><path class="draw-path" pathLength="1" d="m122 96 130-25 21 4m454 0 21-4 130 25-130 24-63-12M122 96v10l130 25 74-14m552-21v10l-130 25-74-14"/></g></svg>`;
 const cards=el('div','orbit-cards');stage.append(scenery,cards);
 const controls=el('div','orbit-controls');
 const previous=el('button','orbit-arrow','←');previous.type='button';previous.setAttribute('aria-label','Previous highlighted project');
 const progress=el('p','orbit-progress');progress.setAttribute('aria-live','polite');progress.setAttribute('aria-atomic','true');
 const next=el('button','orbit-arrow','→');next.type='button';next.setAttribute('aria-label','Next highlighted project');
 controls.append(previous,progress,next);
 const reading=el('div','orbit-reading');
 const titleLine=el('div','orbit-title-line');const titleButton=el('button','orbit-title');titleButton.type='button';const title=el('h3');titleButton.append(title);const status=el('span','status');titleLine.append(titleButton,status);
 const summary=el('p','orbit-summary');const actions=el('div','feature-actions orbit-actions');const notes=el('button','','take a closer look ↗');notes.type='button';actions.append(notes);reading.append(titleLine,summary,actions);
 const trail=el('div','orbit-trail');trail.setAttribute('role','group');trail.setAttribute('aria-label','Choose a highlighted project');
 panel.append(stage,controls,reading,trail);root.append(tabs,intro,panel);
 const indexes=groups.map(()=>0);let groupIndex=0;let cardNodes=[];let trailNodes=[];let swipeStart=null;let swiped=false;
 const current=()=>groups[groupIndex].projects[indexes[groupIndex]];
 const open=trigger=>onOpen(current(),trigger);
 titleButton.addEventListener('click',()=>open(titleButton));notes.addEventListener('click',()=>open(notes));
 const update=(animate=true)=>{
  const group=groups[groupIndex];const index=indexes[groupIndex];const length=group.projects.length;
  cardNodes.forEach((node,i)=>{
   let offset=(i-index+length)%length;if(offset>length/2)offset-=length;
   const position=offset===0?'center':offset===-1?'left':offset===1?'right':'away';
   node.dataset.position=position;node.setAttribute('aria-hidden',String(Math.abs(offset)>1));node.inert=Math.abs(offset)>1;
   node.style.zIndex=offset===0?'3':Math.abs(offset)===1?'2':'0';
   const button=node.querySelector('.feature-visual');button.setAttribute('aria-label',offset===0?`View ${group.projects[i].title} project details`:`Spotlight ${group.projects[i].title}`);
   const preview=node.querySelector('.preview-control');if(preview)preview.hidden=offset!==0;
   trailNodes[i].setAttribute('aria-pressed',String(i===index));
  });
  const project=current();title.textContent=project.title;summary.textContent=project.summary;status.textContent=project.status;
  titleButton.setAttribute('aria-label',`Take a closer look at ${project.title}`);
  progress.textContent=`${String(index+1).padStart(2,'0')} / ${String(length).padStart(2,'0')} · ${group.label}`;
  root.style.setProperty('--orbit-turn',`${index*24}deg`);
  if(animate&&!document.documentElement.classList.contains('motion-reduced')&&!matchMedia('(prefers-reduced-motion:reduce)').matches){reading.getAnimations().forEach(a=>a.cancel());reading.animate([{opacity:.15,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,.68,.2,1)'});}
  onRotate();
 };
 const choose=i=>{indexes[groupIndex]=(i+groups[groupIndex].projects.length)%groups[groupIndex].projects.length;update();};
 const buildGroup=i=>{
  groupIndex=i;const group=groups[i];intro.textContent=group.description;panel.setAttribute('aria-labelledby',`showcase-tab-${group.id}`);
  [...tabs.children].forEach((button,j)=>{button.setAttribute('aria-selected',String(j===i));button.tabIndex=j===i?0:-1;});
  cardNodes=[];trailNodes=[];cards.replaceChildren();trail.replaceChildren();
  group.projects.forEach((project,j)=>{
   const card=el('article','orbit-card');card.dataset.projectId=project.id;card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',`${j+1} of ${group.projects.length}: ${project.title}`);
   const media=createMedia(project,j===indexes[i],(p,trigger)=>{if(swiped){swiped=false;return;}if(j===indexes[i])onOpen(p,trigger);else choose(j);});
   card.append(media,el('p','orbit-card-label',project.title));cards.append(card);cardNodes.push(card);
   const dot=el('button','orbit-dot');dot.type='button';dot.setAttribute('aria-label',`Spotlight ${project.title}`);dot.title=project.title;dot.addEventListener('click',()=>choose(j));trail.append(dot);trailNodes.push(dot);
  });update(false);
 };
 groups.forEach((group,i)=>{
  const tab=el('button','showcase-tab',group.label);tab.type='button';tab.id=`showcase-tab-${group.id}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','orbit-panel');tab.addEventListener('click',()=>buildGroup(i));
  tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowRight'?1:-1)+groups.length)%groups.length;buildGroup(index);tabs.children[index].focus();});tabs.append(tab);
 });
 previous.addEventListener('click',()=>choose(indexes[groupIndex]-1));next.addEventListener('click',()=>choose(indexes[groupIndex]+1));
 panel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(indexes[groupIndex]+(e.key==='ArrowRight'?1:-1));}});
 stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipeStart={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointerup',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){swiped=true;choose(indexes[groupIndex]+(dx<0?1:-1));setTimeout(()=>swiped=false,250);}});
 stage.addEventListener('pointercancel',()=>swipeStart=null);
 buildGroup(0);return root;
}
